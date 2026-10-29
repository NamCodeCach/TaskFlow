"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Client } from "@stomp/stompjs";
import { toast, Toaster } from "sonner";
import {
  LuFolderCheck,
  LuClock,
  LuCheck,
  LuRotateCcw,
  LuSearch,
  LuRefreshCw,
  LuRadio,
  LuChevronLeft,
  LuChevronRight,
  LuArrowRight,
  LuInbox,
  LuLoader,
  LuActivity,
} from "react-icons/lu";
import { API_BASE, WS_BASE } from "@/app/config/api";
import {
  SubmissionItem,
  STATUS_BADGE,
  STATUS_LABEL,
  getAvatarColor,
} from "../submit-task/list/types";

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [totalTasksCount, setTotalTasksCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Bộ lọc & Tìm kiếm danh sách bài nộp
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // 1. Tải danh sách bài nộp và tổng quan tasks từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi song song API lấy danh sách bài nộp và danh sách tasks
      const [submissionsRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE}/api/submissions`, { credentials: "include" }),
        fetch(`${API_BASE}/api/tasks`, { credentials: "include" }),
      ]);

      if (submissionsRes.ok) {
        const subJson = await submissionsRes.json();
        if (subJson.code === "success" && Array.isArray(subJson.data)) {
          setSubmissions(subJson.data);
        }
      }

      if (tasksRes.ok) {
        const taskJson = await tasksRes.json();
        if (taskJson.code === "success" && Array.isArray(taskJson.data)) {
          setTotalTasksCount(taskJson.data.length);
        }
      }
    } catch (err: any) {
      console.error("Lỗi tải dữ liệu Dashboard:", err);
      toast.error("Không thể kết nối máy chủ để tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Kết nối STOMP WebSocket để cập nhật danh sách bài nộp theo thời gian thực (Real-time)
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: WS_BASE,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Lắng nghe sự kiện nộp bài mới hoặc duyệt bài nộp
        stompClient.subscribe("/topic/submissions", (message) => {
          try {
            const incoming: SubmissionItem = JSON.parse(message.body);
            if (!incoming || !incoming.id) return;

            setSubmissions((prev) => {
              const index = prev.findIndex((s) => s.id === incoming.id);
              if (index >= 0) {
                const next = [...prev];
                next[index] = incoming;
                return next;
              } else {
                return [incoming, ...prev];
              }
            });

            const statusText =
              incoming.status === "approved"
                ? "Đã duyệt"
                : incoming.status === "resubmit_requested"
                  ? "Yêu cầu nộp lại"
                  : "Mới nộp";

            toast.info(
              `Bài nộp [${incoming.taskCode}]: ${incoming.submittedByName} (${statusText})`,
              {
                icon: <LuActivity size={18} className="text-main" />,
                duration: 4000,
              },
            );
          } catch (e) {
            console.error("[WS SUBMISSION PARSE ERROR]", e);
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

  // 3. Tính toán các chỉ số thống kê
  const stats = useMemo(() => {
    const totalSubmissions = submissions.length;
    const pendingCount = submissions.filter((s) => s.status === "submitted").length;
    const approvedCount = submissions.filter((s) => s.status === "approved").length;
    const resubmitCount = submissions.filter((s) => s.status === "resubmit_requested").length;
    return {
      totalSubmissions,
      pendingCount,
      approvedCount,
      resubmitCount,
    };
  }, [submissions]);

  // 4. Lọc danh sách bài nộp theo tab trạng thái & từ khóa tìm kiếm
  const filteredSubmissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return submissions.filter((sub) => {
      // Lọc trạng thái
      if (statusFilter !== "ALL" && sub.status !== statusFilter) {
        return false;
      }
      // Lọc tìm kiếm
      if (term) {
        const nameMatch = sub.submittedByName?.toLowerCase().includes(term);
        const codeMatch = sub.taskCode?.toLowerCase().includes(term);
        const titleMatch = sub.taskTitle?.toLowerCase().includes(term);
        const fileMatch = sub.originalFileName?.toLowerCase().includes(term);
        return nameMatch || codeMatch || titleMatch || fileMatch;
      }
      return true;
    });
  }, [submissions, statusFilter, searchTerm]);

  // Phân trang
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage) || 1;
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(start, start + itemsPerPage);
  }, [filteredSubmissions, currentPage, itemsPerPage]);

  // Reset trang về 1 khi đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Hoạt động gần đây (5 bài nộp mới nhất)
  const recentActivities = useMemo(() => {
    return submissions.slice(0, 5);
  }, [submissions]);

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="w-full pb-12">
        {/* ── Tiêu đề trang & Trạng thái Real-time ────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] sm:text-[28px] font-bold text-text">Tổng quan Quản trị</h1>
          </div>
        </div>

        {/* ── Thống kê 4 thẻ (Stat Cards) ────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Tổng bài nộp */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Tổng bài đã nộp</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-main">
                <LuFolderCheck size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{stats.totalSubmissions}</span>
              <span className="text-[11px] text-slate-400">/ {totalTasksCount} nhiệm vụ</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Toàn bộ bài nộp được gửi từ thành viên
            </p>
          </div>

          {/* 2. Chờ duyệt */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/30 p-5 shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between text-xs font-medium text-amber-700">
              <span>Bài nộp chờ duyệt</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <LuClock size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{stats.pendingCount}</span>
              <span className="text-[11px] font-medium text-amber-700">Cần phản hồi</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Đang chờ Quản trị viên xem xét</p>
          </div>
        </div>

        {/* ── Khu vực chính: Danh sách bài nộp & Hoạt động gần đây ── */}
        <div className="mt-6 flex flex-col gap-6 xl:flex-row">
          {/* CỘT TRÁI (LỚN): BẢNG HIỂN THỊ DANH SÁCH BÀI NỘP */}
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-xs">
            {/* Header của bảng: Tiêu đề + Tabs lọc trạng thái + Tìm kiếm */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-text">
                    Danh sách bài nộp của thành viên
                  </h2>
                </div>
              </div>
            </div>

            {/* Thân bảng: Bảng hiển thị dữ liệu bài nộp để xem */}
            <div className="w-full overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                  <LuLoader className="h-7 w-7 animate-spin text-main" />
                  <span className="text-xs">Đang tải danh sách bài nộp từ hệ thống...</span>
                </div>
              ) : paginatedSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-center text-slate-400">
                  <LuInbox size={36} className="text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    Không tìm thấy bài nộp nào phù hợp
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn tab trạng thái khác.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-5 py-3 text-[14px]">Tên task</th>
                      <th className="px-4 py-3 text-[14px] text-left">Người nộp bài</th>
                      <th className="px-4 py-3 text-right sm:text-left text-[14px]">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedSubmissions.map((sub) => {
                      const avatar = getAvatarColor(sub.submittedByEmail);
                      const badge = STATUS_BADGE[sub.status] || STATUS_BADGE.submitted;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* 1. Tên task & Mã task */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 font-mono text-[13px]">
                              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-bold text-main">
                                {sub.taskCode}
                              </span>
                              {sub.taskCategory && (
                                <span className="text-slate-400 font-sans">
                                  · {sub.taskCategory}
                                </span>
                              )}
                            </div>
                            <div
                              className="font-semibold text-[14px] text-text mt-0.5 line-clamp-1 max-w-[260px]"
                              title={sub.taskTitle}
                            >
                              {sub.taskTitle}
                            </div>
                            {sub.note && (
                              <p
                                className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-[260px]"
                                title={sub.note}
                              >
                                Ghi chú: {sub.note}
                              </p>
                            )}
                          </td>

                          {/* 2. Người nộp bài */}
                          <td className="px-4 py-3.5 text-left">
                            <div className="flex items-center gap-2.5">
                              <div className="min-w-0">
                                <p className="font-semibold text-[14px] text-text max-w-[150px]">
                                  {sub.submittedByName}
                                </p>
                                <p className="text-[11px] text-[14px] text-slate-400  max-w-[150px]">
                                  {sub.submittedByEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 3. Trạng thái */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-[14px] text-right sm:text-left">
                            <span className={badge.wrapper}>
                              <span className={badge.dot} />
                              {STATUS_LABEL[sub.status] || sub.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* CỘT PHẢI (NHỎ): HOẠT ĐỘNG GẦN ĐÂY */}
          <div className="w-full xl:w-[320px] shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-main">
                  <LuActivity size={15} />
                </span>
                <h3 className="text-sm font-bold text-text">Hoạt động gần đây</h3>
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {recentActivities.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400 italic">
                  Chưa có hoạt động bài nộp nào
                </p>
              ) : (
                recentActivities.map((act) => {
                  const avatar = getAvatarColor(act.submittedByEmail);
                  return (
                    <div key={act.id} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatar.bg} ${avatar.text}`}
                        >
                          {act.submittedByInitials || act.submittedByName?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-text truncate">
                            {act.submittedByName}
                          </p>
                          <p
                            className="text-[11px] text-slate-500 truncate mt-0.5"
                            title={
                              act.taskTitle ? `[${act.taskCode}] ${act.taskTitle}` : act.taskCode
                            }
                          >
                            Đã nộp bài:{" "}
                            <span className="font-medium text-main">[{act.taskCode}]</span>{" "}
                            {act.taskTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
