"use client";

import { apiGet, apiPut } from "@/lib/api";
import { useEffect, useState } from "react";
import { LuCheck, LuDownload, LuFileText, LuLoader, LuRefreshCw, LuRotateCcw, LuSearch, LuX } from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────
interface Submission {
  id: number;
  taskCode: string;
  taskTitle: string;
  submitterEmail: string;
  submitterName: string;
  fileName: string;
  storedFileName: string;
  fileSize: number;
  fileType: string;
  note: string;
  status: string; // SUBMITTED | APPROVED | REJECTED
  submittedAt: string;
  reviewedAt: string | null;
  reviewedByEmail: string | null;
  reviewNote: string | null;
}

// ─── Status badge ─────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  SUBMITTED: { label: "Chờ duyệt",   cls: "bg-amber-100 text-amber-700",   dot: "bg-amber-500" },
  APPROVED:  { label: "Hoàn thành",  cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  REJECTED:  { label: "Nộp lại",     cls: "bg-red-100 text-red-600",       dot: "bg-red-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.SUBMITTED;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Format helpers ───────────────────────────────────────
function formatBytes(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function getInitials(name: string) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1]?.charAt(0).toUpperCase() ?? "?";
}

// ─── Demo data khi backend chưa chạy ─────────────────────
const DEMO_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    taskCode: "TF-105",
    taskTitle: "Bộ bài đăng mạng xã hội",
    submitterEmail: "linh.nguyen@taskflow.vn",
    submitterName: "Nguyễn Thùy Linh",
    fileName: "bai-dang-thang-10.zip",
    storedFileName: "",
    fileSize: 4320000,
    fileType: "application/zip",
    note: "Em đã hoàn thiện 6 mẫu bài đăng. Nhờ anh xem giúp phần màu sắc và nội dung.",
    status: "SUBMITTED",
    submittedAt: "2026-10-03T10:15:00",
    reviewedAt: null,
    reviewedByEmail: null,
    reviewNote: null,
  },
  {
    id: 2,
    taskCode: "TF-107",
    taskTitle: "Báo cáo hiệu quả tháng 9",
    submitterEmail: "minh.tran@taskflow.vn",
    submitterName: "Trần Quang Minh",
    fileName: "bao-cao-thang9.docx",
    storedFileName: "",
    fileSize: 854000,
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    note: "Báo cáo đã bổ sung số liệu của tất cả các kênh và đề xuất cho tháng tới.",
    status: "SUBMITTED",
    submittedAt: "2026-10-03T09:10:00",
    reviewedAt: null,
    reviewedByEmail: null,
    reviewNote: null,
  },
];

// ─── Component chính ──────────────────────────────────────
export default function AdminSubmitTaskPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Review modal
  const [reviewModal, setReviewModal] = useState<{
    sub: Submission;
    action: "APPROVED" | "REJECTED";
  } | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewing, setReviewing] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Admin email từ localStorage
  const [adminEmail, setAdminEmail] = useState("nam.nguyen@taskflow.vn");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("taskflow_current_user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.email) setAdminEmail(u.email);
      }
    } catch {}
  }, []);

  // ─── Load submissions ───────────────────────────────────
  async function loadSubmissions(showRefreshing = false) {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await apiGet<Submission[]>("/submissions");
      setSubmissions(data);
    } catch {
      // Backend chưa chạy → dùng demo data
      if (!showRefreshing) setSubmissions(DEMO_SUBMISSIONS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadSubmissions(); }, []);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  // ─── Duyệt / Yêu cầu nộp lại ──────────────────────────
  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewModal) return;

    setReviewing(true);
    try {
      const updated = await apiPut<Submission>(`/submissions/${reviewModal.sub.id}/status`, {
        status: reviewModal.action,
        reviewNote: reviewNote,
        reviewedByEmail: adminEmail,
      });

      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );

      showToast(
        reviewModal.action === "APPROVED"
          ? `✓ Đã duyệt hoàn thành bài nộp của ${reviewModal.sub.submitterName}!`
          : `✓ Đã yêu cầu ${reviewModal.sub.submitterName} nộp lại!`,
        true
      );
      setReviewModal(null);
      setReviewNote("");
    } catch (err: any) {
      showToast(`❌ ${err.message}`, false);
    } finally {
      setReviewing(false);
    }
  }

  // ─── Lọc dữ liệu ───────────────────────────────────────
  const filtered = submissions.filter((s) => {
    const matchSearch =
      !search ||
      s.submitterName.toLowerCase().includes(search.toLowerCase()) ||
      s.taskCode.toLowerCase().includes(search.toLowerCase()) ||
      s.taskTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="flex-1">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg animate-in slide-in-from-bottom-4 duration-300 ${
            toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.ok ? <LuCheck size={16} /> : <LuX size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Bài nộp</h1>
          <p className="mt-1 text-slate-500">Xem tài liệu, phản hồi và ghi nhận kết quả của nhóm.</p>
        </div>
        <button
          onClick={() => loadSubmissions(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          <LuRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus-within:border-main focus-within:ring-1 focus-within:ring-main">
          <LuSearch size={14} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã task..."
            className="w-44 bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-main"
        >
          <option value="ALL">Tất cả trạng thái ({submissions.length})</option>
          <option value="SUBMITTED">Chờ duyệt ({submissions.filter(s => s.status === "SUBMITTED").length})</option>
          <option value="APPROVED">Hoàn thành ({submissions.filter(s => s.status === "APPROVED").length})</option>
          <option value="REJECTED">Yêu cầu nộp lại ({submissions.filter(s => s.status === "REJECTED").length})</option>
        </select>
      </div>

      {/* Danh sách bài nộp */}
      {loading ? (
        <div className="mt-10 flex justify-center">
          <LuLoader size={28} className="animate-spin text-main" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 text-center text-sm text-slate-400">
          {search || statusFilter !== "ALL" ? "Không tìm thấy bài nộp phù hợp." : "Chưa có bài nộp nào."}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {filtered.map((sub) => (
            <article key={sub.id} className="rounded-xl border border-slate-200 bg-white p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {getInitials(sub.submitterName)}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{sub.submitterName}</p>
                    <p className="text-xs text-slate-400">Nộp lúc {formatDate(sub.submittedAt)}</p>
                  </div>
                </div>
                <StatusBadge status={sub.status} />
              </div>

              {/* Task info */}
              <p className="mt-4 text-xs font-semibold text-indigo-600">{sub.taskCode} · {sub.taskTitle}</p>

              {/* File info */}
              <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                  <LuFileText size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{sub.fileName}</p>
                  <p className="text-[11px] text-slate-400">{formatBytes(sub.fileSize)} · {sub.fileType?.split("/")[1]?.toUpperCase() ?? "FILE"}</p>
                </div>
                <a
                  href={`http://localhost:8080/api/submissions/${sub.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition"
                  title="Tải xuống"
                >
                  <LuDownload size={14} />
                </a>
              </div>

              {/* Ghi chú user */}
              {sub.note && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-400">Ghi chú của thành viên</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{sub.note}</p>
                </div>
              )}

              {/* Ghi chú Admin (nếu đã duyệt/reject) */}
              {sub.reviewNote && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 p-2.5">
                  <p className="text-xs font-medium text-amber-700">Phản hồi của Admin:</p>
                  <p className="mt-0.5 text-xs text-amber-800">{sub.reviewNote}</p>
                </div>
              )}

              {/* Actions – chỉ hiện khi đang SUBMITTED */}
              {sub.status === "SUBMITTED" ? (
                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => { setReviewModal({ sub, action: "APPROVED" }); setReviewNote(""); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                  >
                    <LuCheck size={13} />
                    Hoàn thành
                  </button>
                  <button
                    onClick={() => { setReviewModal({ sub, action: "REJECTED" }); setReviewNote(""); }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <LuRotateCcw size={13} />
                    Yêu cầu nộp lại
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] text-slate-400">
                    {sub.status === "APPROVED" ? "✓ Đã duyệt hoàn thành" : "↩ Đã yêu cầu nộp lại"} · {formatDate(sub.reviewedAt)}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Thông tin */}
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Khi bạn đánh dấu Hoàn thành, thành viên sẽ nhận được thông báo. Cần chỉnh sửa? Hãy chọn Yêu cầu nộp lại.
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Hiển thị {filtered.length}/{submissions.length} bài nộp · Dữ liệu từ cơ sở dữ liệu thực.
      </p>

      {/* ─── MODAL REVIEW ─── */}
      {reviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !reviewing) setReviewModal(null); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  {reviewModal.action === "APPROVED" ? "✓ Duyệt hoàn thành" : "↩ Yêu cầu nộp lại"}
                </h3>
                <button
                  onClick={() => setReviewModal(null)}
                  disabled={reviewing}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <LuX size={18} />
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Bài nộp của <strong>{reviewModal.sub.submitterName}</strong> · {reviewModal.sub.taskCode}
              </p>
            </div>

            <form onSubmit={handleReview} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  {reviewModal.action === "APPROVED"
                    ? "Ghi chú khen ngợi / phản hồi (tuỳ chọn)"
                    : "Lý do yêu cầu nộp lại *"}
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  required={reviewModal.action === "REJECTED"}
                  rows={3}
                  placeholder={
                    reviewModal.action === "APPROVED"
                      ? "VD: Bài làm tốt, đúng yêu cầu!"
                      : "VD: Thiếu số liệu tháng 9, vui lòng bổ sung..."
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-main focus:ring-1 focus:ring-main placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  disabled={reviewing}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={reviewing}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50 ${
                    reviewModal.action === "APPROVED"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {reviewing ? <LuLoader size={14} className="animate-spin" /> : (reviewModal.action === "APPROVED" ? <LuCheck size={14} /> : <LuRotateCcw size={14} />)}
                  {reviewing ? "Đang xử lý..." : (reviewModal.action === "APPROVED" ? "Xác nhận hoàn thành" : "Xác nhận nộp lại")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
