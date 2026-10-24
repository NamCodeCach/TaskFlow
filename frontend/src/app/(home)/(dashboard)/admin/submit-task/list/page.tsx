"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LuSearch,
  LuChevronDown,
  LuFilterX,
  LuRefreshCw,
} from "react-icons/lu";
import SubmissionCard from "./SubmissionCard";
import {
  API_BASE,
  ApiResponse,
  SubmissionItem,
  SubmissionStatus,
} from "./types";

export default function AdminSubmitTaskListPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Thông báo phản hồi người dùng
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
  };

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // ── Lấy danh sách bài nộp từ API thực tế ────────────────────────────────
  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/submissions`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi HTTP ${res.status}`);
      }
      const json: ApiResponse<SubmissionItem[]> = await res.json();
      if (json.code === "success" && Array.isArray(json.data)) {
        setSubmissions(json.data);
      } else {
        setError(json.message || "Không thể tải danh sách bài nộp.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ backend (http://localhost:8080). Hãy đảm bảo backend đang chạy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // ── Cập nhật trạng thái tức thì sau khi bấm Duyệt / Yêu cầu nộp lại ─────
  const handleStatusChange = (
    id: number,
    newStatus: SubmissionStatus,
    message: string,
  ) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
    showNotification("success", message);
  };

  // ── Đặt lại bộ lọc ─────────────────────────────────────────────────────
  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  // ── Lọc danh sách bài nộp ──────────────────────────────────────────────
  const filteredSubmissions = useMemo(() => {
    const s = search.trim().toLowerCase();
    return submissions.filter((sub) => {
      const matchSearch =
        !s ||
        (sub.submittedByName && sub.submittedByName.toLowerCase().includes(s)) ||
        (sub.taskCode && sub.taskCode.toLowerCase().includes(s)) ||
        (sub.taskTitle && sub.taskTitle.toLowerCase().includes(s)) ||
        (sub.originalFileName && sub.originalFileName.toLowerCase().includes(s));

      const matchStatus =
        statusFilter === "ALL" || sub.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [submissions, search, statusFilter]);

  return (
    <>
      {/* Toast thông báo nổi góc trên */}
      {notification && (
        <div className="fixed right-6 top-24 z-50 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2">
          {notification.type === "success" ? (
            <svg
              className="h-5 w-5 text-emerald-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-rose-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span className="text-xs font-semibold text-slate-700">
            {notification.text}
          </span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Header trang */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[28px] font-bold text-text">Quản lý bài nộp</h3>
          <p className="mt-1 text-xs text-slate-500">
            Xem tài liệu, phản hồi và duyệt kết quả làm việc của các thành viên.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
        >
          <LuRefreshCw size={14} className={loading ? "animate-spin text-main" : ""} />
          Làm mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 shadow-[0px_4px_16px_0px_#1018280A]">
        {/* Tìm kiếm */}
        <label className="flex h-[42px] min-w-[260px] flex-1 items-center gap-2.5 rounded-[12px] border border-[#E2E8F0] bg-white px-4 text-[13px]">
          <LuSearch size={16} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên thành viên, mã task, tên task hoặc file..."
            className="w-full bg-transparent text-[13px] text-text outline-none placeholder:text-slate-400"
          />
        </label>

        {/* Lọc trạng thái */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[42px] w-[190px] cursor-pointer appearance-none rounded-[12px] border border-[#E2E8F0] bg-white px-4 pr-9 text-[13px] text-[#475569] outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="submitted">Chờ duyệt</option>
            <option value="approved">Hoàn thành</option>
            <option value="resubmit_requested">Yêu cầu nộp lại</option>
          </select>
          <LuChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Nút đặt lại */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="flex h-[42px] cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition"
        >
          <LuFilterX size={14} />
          Đặt lại
        </button>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-rose-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchSubmissions}
            className="font-bold underline hover:no-underline cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-main" />
          <p className="text-xs text-slate-400">Đang tải danh sách bài nộp từ hệ thống...</p>
        </div>
      )}

      {/* Danh sách bài nộp */}
      {!loading && !error && (
        <>
          {filteredSubmissions.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-600">
                Không tìm thấy bài nộp nào phù hợp
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc trạng thái.
              </p>
              {(search || statusFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-main hover:bg-indigo-100 transition cursor-pointer"
                >
                  <LuFilterX size={12} />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredSubmissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  onStatusChange={handleStatusChange}
                  onError={(msg) => showNotification("error", msg)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Phân trang / số lượng */}
      {!loading && !error && (
        <p className="mt-5 text-xs text-[#94A3B8]">
          Hiển thị {filteredSubmissions.length} trên tổng số {submissions.length} bài nộp.
        </p>
      )}
    </>
  );
}
