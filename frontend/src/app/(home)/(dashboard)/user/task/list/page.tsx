"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Client } from "@stomp/stompjs";
import {
  LuCalendar,
  LuClock,
  LuFolder,
  LuBell,
  LuCheck,
  LuTriangleAlert,
  LuArrowUpDown,
  LuSearch,
  LuLoader,
  LuUpload,
  LuInbox,
  LuUser,
} from "react-icons/lu";
import { toast, Toaster } from "sonner";
import { taskService, TaskItem } from "@/src/app/services/taskService";

export default function UserTaskListPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "deadline">("newest");

  // 1. Lấy thông tin thành viên đang đăng nhập từ localStorage hoặc Cookie
  useEffect(() => {
    try {
      const stored = localStorage.getItem("taskflow_current_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error("Lỗi đọc thông tin người dùng:", e);
    }
  }, []);

  // 2. Tải danh sách nhiệm vụ được giao cho thành viên này
  const fetchMyTasks = async (userId: number) => {
    setIsLoading(true);
    try {
      const res = await taskService.getMyTasks(userId);
      if (res.code === "success" && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        toast.error(res.message || "Không thể tải danh sách nhiệm vụ của bạn!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.userId) {
      // Nếu chưa có userId, tạm thời thử gọi API lấy tất cả hoặc chờ user load
      setIsLoading(false);
      return;
    }

    fetchMyTasks(currentUser.userId);

    // 3. Kết nối STOMP WebSocket để nhận thông báo tức thì ngay trong trang
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Lắng nghe sự kiện Admin giao nhiệm vụ mới
        stompClient.subscribe("/topic/tasks", (message) => {
          try {
            const newTask: TaskItem = JSON.parse(message.body);
            if (!newTask || !newTask.id) return;

            // Kiểm tra xem nhiệm vụ này có được phân công cho Thành viên đang đăng nhập không
            const isAssignedToMe =
              newTask.assignees &&
              newTask.assignees.some(
                (a) =>
                  a.id === currentUser.userId ||
                  (a.email &&
                    currentUser.email &&
                    a.email.toLowerCase() === currentUser.email.toLowerCase())
              );

            if (isAssignedToMe) {
              // BẬT THÔNG BÁO TỨC THÌ NGAY TRONG TRANG
              toast.info(
                `Bạn vừa nhận được nhiệm vụ mới: [${newTask.taskCode}] ${newTask.title}`,
                {
                  description: `Hạn nộp: ${newTask.deadline || "Không có thời hạn"} · Danh mục: ${newTask.category || "Chung"}`,
                  icon: <LuBell size={20} className="text-main shrink-0" />,
                  duration: 8000,
                }
              );

              // Tự động chèn nhiệm vụ mới vào đầu danh sách mà không cần F5
              setTasks((prev) => [newTask, ...prev.filter((t) => t.id !== newTask.id)]);
            }
          } catch (e) {
            console.error("[WS USER TASK ERROR]", e);
          }
        });

        // Lắng nghe cập nhật trạng thái nhiệm vụ
        stompClient.subscribe("/topic/tasks/updated", (message) => {
          try {
            const updatedTask: TaskItem = JSON.parse(message.body);
            if (updatedTask && updatedTask.id) {
              setTasks((prev) => {
                const exists = prev.some((t) => t.id === updatedTask.id);
                if (exists) {
                  return prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
                }
                return prev;
              });
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
  }, [currentUser]);

  // Hàm chuẩn hóa tiếng Việt bỏ dấu để tìm kiếm
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // Thống kê số lượng nhiệm vụ theo từng trạng thái
  const counts = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const submitted = tasks.filter((t) => t.status === "SUBMITTED").length;
    const overdue = tasks.filter((t) => t.status === "OVERDUE").length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    return { total, todo, submitted, overdue, completed };
  }, [tasks]);

  // Lọc và sắp xếp danh sách nhiệm vụ
  const filteredTasks = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const normalizedSearch = removeAccents(cleanSearch);

    let result = tasks.filter((t) => {
      // Khớp tab trạng thái
      if (activeTab !== "ALL" && t.status !== activeTab) {
        return false;
      }

      // Khớp từ khóa tìm kiếm
      if (cleanSearch) {
        const titleMatch =
          (t.title && t.title.toLowerCase().includes(cleanSearch)) ||
          (t.title && removeAccents(t.title).includes(normalizedSearch));
        const codeMatch = t.taskCode && t.taskCode.toLowerCase().includes(cleanSearch);
        const catMatch =
          (t.category && t.category.toLowerCase().includes(cleanSearch)) ||
          (t.category && removeAccents(t.category).includes(normalizedSearch));
        const descMatch =
          (t.description && t.description.toLowerCase().includes(cleanSearch)) ||
          (t.description && removeAccents(t.description).includes(normalizedSearch));

        return titleMatch || codeMatch || catMatch || descMatch;
      }

      return true;
    });

    // Sắp xếp
    if (sortBy === "deadline") {
      result = [...result].sort((a, b) => {
        if (!a.rawDeadline) return 1;
        if (!b.rawDeadline) return -1;
        return new Date(a.rawDeadline).getTime() - new Date(b.rawDeadline).getTime();
      });
    }

    return result;
  }, [tasks, activeTab, searchTerm, sortBy]);

  // Render badge trạng thái
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "TODO":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            <LuClock size={13} className="text-slate-500" />
            Cần làm
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <LuUpload size={13} className="text-amber-600" />
            Đã nộp bài
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700">
            <LuTriangleAlert size={13} className="text-rose-600" />
            Quá hạn
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <LuCheck size={13} className="text-emerald-600" />
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

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="w-full pb-12">
        {/* ── Tiêu đề trang & Lời chào ───────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-text">
              Xin chào, {currentUser?.fullName || "Thành viên"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Bạn có{" "}
              <strong className="text-main font-semibold">{counts.todo}</strong> nhiệm vụ cần xử lý.
              Cùng tạo nên một ngày làm việc hiệu quả!
            </p>
          </div>
        </div>

        {/* ── Thanh lọc Tab & Sắp xếp ────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs trạng thái */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-main text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Tất cả <span className="ml-1 opacity-90">{counts.total}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("TODO")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "TODO"
                  ? "bg-main text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Cần làm <span className="ml-1 opacity-90">{counts.todo}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("SUBMITTED")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "SUBMITTED"
                  ? "bg-main text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Đã nộp <span className="ml-1 opacity-90">{counts.submitted}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("OVERDUE")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "OVERDUE"
                  ? "bg-main text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Quá hạn <span className="ml-1 opacity-90">{counts.overdue}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("COMPLETED")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                activeTab === "COMPLETED"
                  ? "bg-main text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Hoàn thành <span className="ml-1 opacity-90">{counts.completed}</span>
            </button>
          </div>

          {/* Ô tìm kiếm & Sắp xếp */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 focus-within:border-main">
              <LuSearch size={14} className="text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhiệm vụ..."
                className="w-[180px] bg-transparent text-xs text-text outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setSortBy(sortBy === "newest" ? "deadline" : "newest")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <LuArrowUpDown size={14} />
              <span>{sortBy === "newest" ? "Mới nhất trước" : "Hạn nộp gần nhất"}</span>
            </button>
          </div>
        </div>

        {/* ── Danh sách Thẻ nhiệm vụ (Task Cards) ────────────────── */}
        <div className="mt-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 rounded-2xl border border-slate-200 bg-white">
              <LuLoader className="animate-spin text-2xl text-main" />
              <span className="text-xs">Đang tải danh sách nhiệm vụ của bạn...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400 rounded-2xl border border-dashed border-slate-300 bg-white">
              <LuInbox size={40} className="text-slate-300" />
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Không có nhiệm vụ nào trong mục này
              </p>
              <p className="text-xs text-slate-400">
                Khi quản trị viên giao nhiệm vụ cho bạn, nhiệm vụ sẽ tự động hiển thị ở đây.
              </p>
            </div>
          ) : (
            <div className="grid gap-4.5 md:grid-cols-2">
              {filteredTasks.map((task) => {
                const isOverdue = task.status === "OVERDUE";

                return (
                  <article
                    key={task.id}
                    className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0px_2px_8px_0px_#10182808] hover:shadow-md transition-shadow animate-in fade-in duration-150"
                  >
                    <div>
                      {/* Header Card: Mã task, Danh mục & Trạng thái */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-main">
                            <LuFolder size={16} />
                          </span>
                          <div>
                            <span className="font-bold text-main">{task.taskCode}</span>
                            <span className="mx-1 text-slate-300">·</span>
                            <span className="text-slate-600 font-sans font-medium">
                              {task.category || "Chung"}
                            </span>
                          </div>
                        </div>

                        {renderStatusBadge(task.status)}
                      </div>

                      {/* Tiêu đề */}
                      <h2 className="mt-3.5 text-base font-bold text-text leading-snug">
                        {task.title}
                      </h2>

                      {/* Mô tả yêu cầu */}
                      {task.description ? (
                        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                          {task.description}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs italic text-slate-400">
                          Không có mô tả chi tiết kèm theo.
                        </p>
                      )}

                      {/* Hạn nộp */}
                      <div className="mt-3.5 flex items-center gap-2 text-xs">
                        <div
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 ${
                            isOverdue
                              ? "bg-rose-50 text-rose-700 font-semibold"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          <LuCalendar size={14} className={isOverdue ? "text-rose-600" : "text-slate-400"} />
                          <span>Hạn nộp: {task.deadline || "Không có hạn"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Card */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-600">
                          <LuUser size={13} />
                        </span>
                        <span className="text-[11px] text-slate-500">Quản trị viên giao</span>
                      </div>

                      <Link
                        href={`/user/task/submitted?taskId=${task.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-main px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-main/90 transition"
                      >
                        <LuUpload size={13} />
                        <span>{task.status === "SUBMITTED" ? "Xem bài nộp" : "Nộp bài"}</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
