"use client";

import { WS_BASE } from "@/app/config/api";

import { useEffect, useState, useMemo } from "react";
import { Client } from "@stomp/stompjs";
import {
  LuSearch,
  LuChevronDown,
  LuCalendar,
  LuTrash2,
  LuPlus,
  LuUsers,
  LuLoader,
  LuClock,
  LuTriangleAlert,
  LuFolder,
  LuX,
} from "react-icons/lu";
import { toast, Toaster } from "sonner";
import { taskService, TaskItem, Assignee } from "@/src/app/services/taskService";
import { CreateTaskModal } from "./CreateTaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";

const AVATAR_COLORS = [
  { bg: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-200" },
  { bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-200" },
  { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200" },
  { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-200" },
  { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200" },
  { bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-200" },
];

export default function AdminTaskListPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);

  // 1. Tải danh sách nhiệm vụ từ CSDL
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await taskService.getAll();
      if (res.code === "success" && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        toast.error(res.message || "Không thể tải danh sách nhiệm vụ!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Tải dữ liệu ban đầu
    fetchTasks();

    // 2. Kết nối WebSocket STOMP để nhận dữ liệu Real-time
    const stompClient = new Client({
      brokerURL: WS_BASE,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Lắng nghe tạo nhiệm vụ mới
        stompClient.subscribe("/topic/tasks", (message) => {
          try {
            const newTask: TaskItem = JSON.parse(message.body);
            if (newTask && newTask.id) {
              setTasks((prev) => [newTask, ...prev.filter((t) => t.id !== newTask.id)]);
              toast.info(`Nhiệm vụ mới vừa được giao: [${newTask.taskCode}] ${newTask.title}`);
            }
          } catch (e) {
            console.error("[WS TASK CREATE ERROR]", e);
          }
        });

        // Lắng nghe cập nhật trạng thái nhiệm vụ
        stompClient.subscribe("/topic/tasks/updated", (message) => {
          try {
            const updatedTask: TaskItem = JSON.parse(message.body);
            if (updatedTask && updatedTask.id) {
              setTasks((prev) =>
                prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
              );
              toast.info(`Nhiệm vụ [${updatedTask.taskCode}] vừa được cập nhật.`);
            }
          } catch (e) {
            console.error("[WS TASK UPDATE ERROR]", e);
          }
        });

        // Lắng nghe xóa nhiệm vụ
        stompClient.subscribe("/topic/tasks/deleted", (message) => {
          try {
            const deletedId = Number(message.body);
            if (deletedId) {
              setTasks((prev) => prev.filter((t) => t.id !== deletedId));
              toast.info("Một nhiệm vụ vừa được xóa khỏi hệ thống.");
            }
          } catch (e) {
            console.error("[WS TASK DELETE ERROR]", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[STOMP ERROR]", frame.headers["message"]);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // Callback khi tạo nhiệm vụ thành công
  const handleTaskCreated = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev.filter((t) => t.id !== newTask.id)]);
  };

  // Callback khi xóa nhiệm vụ thành công
  const handleTaskDeleted = (deletedId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
  };

  // Hàm chuẩn hóa chuỗi tiếng Việt (bỏ dấu) để tìm kiếm
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // Lọc nhiệm vụ theo từ khóa, trạng thái và ngày
  const filteredTasks = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const normalizedSearch = removeAccents(cleanSearch);

    return tasks.filter((t) => {
      // Tìm theo tiêu đề, mã task hoặc danh mục
      const titleMatch =
        (t.title && t.title.toLowerCase().includes(cleanSearch)) ||
        (t.title && removeAccents(t.title).includes(normalizedSearch));
      const codeMatch = t.taskCode && t.taskCode.toLowerCase().includes(cleanSearch);
      const catMatch =
        (t.category && t.category.toLowerCase().includes(cleanSearch)) ||
        (t.category && removeAccents(t.category).includes(normalizedSearch));

      // Tìm theo tên thành viên được phân công
      const assigneeMatch =
        t.assignees &&
        t.assignees.some(
          (a) =>
            a.fullName.toLowerCase().includes(cleanSearch) ||
            removeAccents(a.fullName).includes(normalizedSearch) ||
            a.email.toLowerCase().includes(cleanSearch)
        );

      const matchSearch = !cleanSearch || titleMatch || codeMatch || catMatch || assigneeMatch;

      // Lọc theo trạng thái
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;

      // Lọc theo ngày
      let matchDate = true;
      if (dateFilter && t.rawDeadline) {
        matchDate = t.rawDeadline.startsWith(dateFilter);
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [tasks, searchTerm, statusFilter, dateFilter]);

  // Thống kê số lượng
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const submitted = tasks.filter((t) => t.status === "SUBMITTED").length;
    const overdue = tasks.filter((t) => t.status === "OVERDUE").length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    return { total, todo, submitted, overdue, completed };
  }, [tasks]);

  // Render badge trạng thái
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "TODO":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Cần làm
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Đã nộp
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Quá hạn
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {status}
          </span>
        );
    }
  };

  // Render danh sách avatar nhiều người được phân công
  const renderAssigneesGroup = (assignees: Assignee[]) => {
    if (!assignees || assignees.length === 0) {
      return <span className="text-xs text-slate-400 italic">Chưa phân công</span>;
    }

    const displayAssignees = assignees.slice(0, 3);
    const remainingCount = assignees.length - 3;

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2 overflow-hidden py-0.5">
          {displayAssignees.map((a, idx) => {
            const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div
                key={a.id}
                title={`${a.fullName} (${a.email})`}
                className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-white ${color.bg} ${color.text} shadow-xs transition-transform hover:scale-110 hover:z-10`}
              >
                {a.initials}
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div
              title={assignees
                .slice(3)
                .map((a) => a.fullName)
                .join(", ")}
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 ring-2 ring-white shadow-xs"
            >
              +{remainingCount}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
            {assignees.length === 1
              ? assignees[0].fullName
              : `${assignees[0].fullName} +${assignees.length - 1}`}
          </p>
          <p className="text-[11px] text-slate-400">
            {assignees.length} thành viên
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="task-list w-full pb-12">
        {/* ── Tiêu đề & Nút Tạo task ─────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-text">Quản lý Nhiệm vụ</h1>
            <p className="text-xs text-slate-500 mt-1">
              Phân công công việc cho thành viên, giám sát hạn nộp và nhận cập nhật thời gian thực.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-main px-4 text-xs font-semibold text-white shadow-sm hover:bg-main/90 transition"
          >
            <LuPlus size={16} />+ Tạo task mới
          </button>
        </div>

        {/* ── Thẻ thống kê nhanh ──────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-[14px] border border-slate-200 bg-white p-3.5 shadow-xs">
            <span className="text-xs text-slate-500">Tổng nhiệm vụ</span>
            <p className="text-xl font-bold text-text mt-1">{stats.total}</p>
          </div>
          <div className="rounded-[14px] border border-slate-200 bg-white p-3.5 shadow-xs">
            <span className="text-xs text-slate-500">Cần làm</span>
            <p className="text-xl font-bold text-slate-700 mt-1">{stats.todo}</p>
          </div>
          <div className="rounded-[14px] border border-amber-200 bg-amber-50/50 p-3.5 shadow-xs">
            <span className="text-xs text-amber-700">Đã nộp bài</span>
            <p className="text-xl font-bold text-amber-800 mt-1">{stats.submitted}</p>
          </div>
          <div className="rounded-[14px] border border-rose-200 bg-rose-50/50 p-3.5 shadow-xs">
            <span className="text-xs text-rose-700">Quá hạn</span>
            <p className="text-xl font-bold text-rose-800 mt-1">{stats.overdue}</p>
          </div>
        </div>

        {/* ── Bảng danh sách Task ─────────────────────────────────── */}
        <div className="mt-6 w-full overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0px_4px_16px_0px_#1018280A]">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#F1F5F9]">
            <h2 className="text-base font-bold text-text">Danh sách nhiệm vụ được giao</h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Tìm kiếm */}
              <label className="box flex h-[40px] w-full sm:w-[260px] items-center gap-2 rounded-[10px] border border-[#E2E8F0] px-3">
                <LuSearch size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên, mã task, người nhận..."
                  className="w-full bg-transparent text-xs text-text outline-none placeholder:text-slate-400"
                />
              </label>

              {/* Lọc Trạng thái */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="box h-[40px] w-[170px] appearance-none rounded-[10px] border border-[#E2E8F0] bg-white pl-3 pr-8 text-xs text-[#475569] outline-none cursor-pointer"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="TODO">Cần làm</option>
                  <option value="SUBMITTED">Đã nộp</option>
                  <option value="OVERDUE">Quá hạn</option>
                  <option value="COMPLETED">Hoàn thành</option>
                </select>
                <LuChevronDown
                  size={16}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Lọc theo ngày hạn nộp */}
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="box h-[40px] w-[150px] rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-xs text-[#475569] outline-none cursor-pointer"
                  title="Lọc theo ngày hạn nộp"
                />
                {dateFilter && (
                  <button
                    type="button"
                    onClick={() => setDateFilter("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Xóa bộ lọc ngày"
                  >
                    <LuX size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <LuLoader className="animate-spin text-2xl text-main" />
                <span className="text-xs">Đang tải danh sách nhiệm vụ từ CSDL...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                <LuFolder className="text-3xl text-slate-300" />
                <span className="text-sm font-medium">Không tìm thấy nhiệm vụ nào phù hợp</span>
              </div>
            ) : (
              <table className="w-full min-w-[860px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                    <th className="w-[30%] px-5 py-3.5">Nhiệm vụ</th>
                    <th className="w-[26%] px-4 py-3.5">Người nhận</th>
                    <th className="w-[18%] px-4 py-3.5">Hạn nộp</th>
                    <th className="w-[14%] px-4 py-3.5">Trạng thái</th>
                    <th className="w-[12%] px-4 py-3.5 text-center">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F1F5F9] text-sm text-text">
                  {filteredTasks.map((t) => {
                    const isOverdue = t.status === "OVERDUE";

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-50/70 transition-colors animate-in fade-in duration-150"
                      >
                        {/* Tên task & Danh mục */}
                        <td className="px-5 py-3.5">
                          <div className="min-w-0">
                            <p className="font-semibold text-text truncate">{t.title}</p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="font-mono font-bold text-main">{t.taskCode}</span>
                              <span>·</span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                                {t.category || "Chung"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Người nhận (Nhiều người - Avatar Group) */}
                        <td className="px-4 py-3.5">
                          {renderAssigneesGroup(t.assignees)}
                        </td>

                        {/* Hạn nộp */}
                        <td className="px-4 py-3.5 text-xs">
                          <div
                            className={`flex items-center gap-1.5 ${
                              isOverdue ? "text-rose-600 font-semibold" : "text-slate-600"
                            }`}
                          >
                            <LuCalendar size={14} className="shrink-0" />
                            <span>{t.deadline || "Không có hạn"}</span>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-4 py-3.5">
                          {renderStatusBadge(t.status)}
                        </td>

                        {/* Thao tác */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2 text-slate-500">
                            <button
                              type="button"
                              onClick={() => setDeletingTask(t)}
                              className="rounded-lg p-1.5 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                              title="Xóa nhiệm vụ"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer thông tin */}
          <div className="flex items-center justify-between border-t border-[#F1F5F9] px-5 py-3.5 text-xs text-slate-500">
            <span>
              Hiển thị <strong className="text-slate-700">{filteredTasks.length}</strong> trên tổng số{" "}
              <strong className="text-slate-700">{tasks.length}</strong> nhiệm vụ
            </span>
          </div>
        </div>
      </div>

      {/* Modal Tạo Task */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleTaskCreated}
      />

      {/* Modal Xóa Task */}
      <DeleteTaskModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onSuccess={handleTaskDeleted}
      />
    </>
  );
}
