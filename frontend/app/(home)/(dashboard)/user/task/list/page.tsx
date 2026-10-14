"use client";

import { apiGet, apiPostForm } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FaSortAmountDown } from "react-icons/fa";
import { LuCheck, LuClock, LuFileText, LuLoader, LuUpload, LuX } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";

// ─── Types ───────────────────────────────────────────────
interface Task {
  id: number;
  taskCode: string;
  title: string;
  description: string;
  status: string; // TODO | SUBMITTED | APPROVED | OVERDUE | REJECTED
  category: string;
  deadline: string | null;
  assignedToEmail: string;
  assignedToName: string;
  createdByEmail: string;
  createdAt: string;
}

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

// ─── Status badge helper ──────────────────────────────────
const STATUS_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  TODO:      { label: "Cần làm",       cls: "bg-slate-100 text-slate-600",  dot: "bg-slate-500" },
  SUBMITTED: { label: "Đã nộp",        cls: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
  APPROVED:  { label: "Hoàn thành",    cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  OVERDUE:   { label: "Quá hạn",       cls: "bg-red-100 text-red-700",      dot: "bg-red-500" },
  REJECTED:  { label: "Nộp lại",       cls: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.TODO;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Hardcode fallback khi backend chưa chạy ────────────
const DEMO_TASKS: Task[] = [
  {
    id: 1,
    taskCode: "TF-108",
    title: "Thiết kế banner",
    description: "Thiết kế banner cho chiến dịch tháng 10. Kích thước 1920 × 600 px, sử dụng bộ nhận diện thương hiệu.",
    status: "TODO",
    category: "Thiết kế",
    deadline: "2026-10-05T17:00:00",
    assignedToEmail: "",
    assignedToName: "",
    createdByEmail: "nam.nguyen@taskflow.vn",
    createdAt: "2026-10-01T08:00:00",
  },
  {
    id: 2,
    taskCode: "TF-109",
    title: "Viết báo cáo Q4",
    description: "Tổng hợp số liệu và viết báo cáo tổng kết quý 4 năm 2026.",
    status: "TODO",
    category: "Báo cáo",
    deadline: "2026-10-15T17:00:00",
    assignedToEmail: "",
    assignedToName: "",
    createdByEmail: "nam.nguyen@taskflow.vn",
    createdAt: "2026-10-02T08:00:00",
  },
];

// ─── Component chính ─────────────────────────────────────
export default function UserTaskListPage() {
  const [userName, setUserName] = useState("Người dùng");
  const [userEmail, setUserEmail] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [uploadTask, setUploadTask] = useState<Task | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Load user từ localStorage ─────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("taskflow_current_user");
        if (raw) {
          const u: CurrentUser = JSON.parse(raw);
          if (u.fullName) setUserName(u.fullName);
          if (u.email) setUserEmail(u.email);
        }
      } catch {}
    }
  }, []);

  // ─── Load task từ backend hoặc dùng demo ───────────────
  useEffect(() => {
    if (!userEmail) return;

    async function loadTasks() {
      setLoading(true);
      try {
        const data = await apiGet<Task[]>(`/tasks/user?email=${encodeURIComponent(userEmail)}`);
        setTasks(data.length > 0 ? data : DEMO_TASKS);
      } catch {
        // Backend chưa chạy → dùng demo tasks
        setTasks(DEMO_TASKS);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [userEmail]);

  // ─── Hiển thị toast ─────────────────────────────────────
  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  // ─── Mở modal nộp bài ──────────────────────────────────
  function openUploadModal(task: Task) {
    setUploadTask(task);
    setSelectedFile(null);
    setNote("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function closeModal() {
    if (uploading) return;
    setUploadTask(null);
    setSelectedFile(null);
    setNote("");
  }

  // ─── Xử lý chọn file ───────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn 50MB
    if (file.size > 50 * 1024 * 1024) {
      showToast("❌ File quá lớn! Tối đa 50MB.", false);
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  }

  // ─── Nộp bài – gọi API backend ─────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadTask || !selectedFile) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("taskCode", uploadTask.taskCode);
      form.append("taskTitle", uploadTask.title);
      form.append("submitterEmail", userEmail);
      form.append("submitterName", userName);
      form.append("note", note);
      form.append("file", selectedFile);

      await apiPostForm("/submissions", form);

      // Cập nhật trạng thái task trong UI
      setTasks((prev) =>
        prev.map((t) =>
          t.id === uploadTask.id ? { ...t, status: "SUBMITTED" } : t
        )
      );

      showToast(`✓ Nộp bài thành công! "${uploadTask.title}"`, true);
      closeModal();
    } catch (err: any) {
      showToast(`❌ ${err.message ?? "Lỗi khi nộp bài, vui lòng thử lại!"}`, false);
    } finally {
      setUploading(false);
    }
  }

  // ─── Format bytes ──────────────────────────────────────
  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ─── Format deadline ──────────────────────────────────
  function formatDeadline(iso: string | null) {
    if (!iso) return "Không có hạn";
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  // ─── RENDER ──────────────────────────────────────────
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

      <h1 className="text-2xl font-bold text-text">Xin chào, {userName} 👋</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bạn có {tasks.filter((t) => t.status === "TODO" || t.status === "OVERDUE").length} task cần xử lý.
        Cùng tạo nên một ngày làm việc hiệu quả!
      </p>

      {/* Tab filter */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-main px-4 py-2 text-xs font-semibold text-white">
            Tất cả <span className="ml-1 font-normal">{tasks.length}</span>
          </button>
        </div>
        <button type="button" className="inline-flex items-center gap-2 text-xs text-slate-500">
          Mới nhất trước
          <FaSortAmountDown />
        </button>
      </div>

      {/* Danh sách task */}
      {loading ? (
        <div className="mt-10 flex justify-center">
          <LuLoader className="animate-spin text-main" size={28} />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-main/10 text-main">
                    <MdOutlineFileUpload />
                  </span>
                  {task.taskCode} · {task.category}
                </div>
                <StatusBadge status={task.status} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-text">{task.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{task.description}</p>

              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <CiCalendar className="h-[17px] w-[17px] text-[#687386]" />
                Hạn nộp: {formatDeadline(task.deadline)}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-main/10 text-[10px] font-bold text-main">
                    {task.createdByEmail?.substring(0, 2).toUpperCase() ?? "AD"}
                  </span>
                  {task.createdByEmail?.split("@")[0] ?? "Admin"} giao
                </div>

                {/* Nút nộp bài – chỉ hiện khi task chưa nộp */}
                {(task.status === "TODO" || task.status === "OVERDUE" || task.status === "REJECTED") ? (
                  <button
                    onClick={() => openUploadModal(task)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-main px-4 py-2 text-xs font-semibold text-white hover:bg-main/90 transition"
                  >
                    <MdOutlineFileUpload className="h-[16px] w-[16px]" />
                    Nộp bài
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <LuCheck size={14} />
                    {task.status === "SUBMITTED" ? "Đã nộp" : "Hoàn thành"}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        Hiển thị {tasks.length} task của bạn · Cập nhật theo thời gian thực.
      </p>

      {/* ─── MODAL NỘP BÀI ─── */}
      {uploadTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-semibold text-indigo-600">{uploadTask.taskCode} · {uploadTask.category}</p>
                <h3 className="mt-0.5 text-base font-bold text-slate-800">{uploadTask.title}</h3>
              </div>
              <button
                onClick={closeModal}
                disabled={uploading}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {/* Chọn file */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  File đính kèm <span className="text-red-500">*</span>
                </label>

                {!selectedFile ? (
                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 hover:border-main hover:bg-main/5 transition">
                    <LuUpload size={28} className="text-slate-400" />
                    <p className="mt-2 text-xs font-semibold text-slate-600">Kéo thả hoặc bấm để chọn file</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">PDF, Word, Excel, ZIP, ảnh... (tối đa 50MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.png,.jpg,.jpeg,.gif,.mp4,.mov"
                    />
                  </label>
                ) : (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                      <LuFileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500">{formatBytes(selectedFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-white hover:text-red-500 transition cursor-pointer"
                    >
                      <LuX size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Ghi chú <span className="text-slate-400 font-normal">(tuỳ chọn)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Nhập ghi chú cho Admin về bài nộp của bạn..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-main focus:ring-1 focus:ring-main placeholder:text-slate-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="flex items-center gap-2 rounded-xl bg-main px-5 py-2.5 text-xs font-semibold text-white hover:bg-main/90 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <LuLoader size={14} className="animate-spin" />
                      Đang nộp...
                    </>
                  ) : (
                    <>
                      <LuUpload size={14} />
                      Nộp bài
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
