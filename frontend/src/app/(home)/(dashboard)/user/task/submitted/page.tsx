"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LuUpload,
  LuFileText,
  LuCheck,
  LuArrowLeft,
  LuLoader,
  LuCalendar,
  LuFolder,
  LuTriangleAlert,
} from "react-icons/lu";
import { toast, Toaster } from "sonner";
import { taskService, TaskItem } from "@/src/app/services/taskService";

function TaskSubmitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("taskflow_current_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Lỗi đọc người dùng:", e);
    }
  }, []);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await taskService.getById(Number(taskId));
        if (res.code === "success" && res.data) {
          setTask(res.data);
        } else {
          toast.error(res.message || "Không thể tải thông tin nhiệm vụ.");
        }
      } catch (err: any) {
        toast.error(err.message || "Lỗi kết nối máy chủ!");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn tệp tin đính kèm!");
      return;
    }
    if (!task?.id) {
      toast.error("Không tìm thấy nhiệm vụ hợp lệ!");
      return;
    }
    if (!currentUser?.userId) {
      toast.error("Vui lòng đăng nhập để nộp bài!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", String(task.id));
      formData.append("userId", String(currentUser.userId));
      if (note.trim()) {
        formData.append("note", note.trim());
      }

      const res = await fetch("http://localhost:8080/api/upload/submit", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (data.code === "success") {
        toast.success("Nộp bài thành công!", {
          icon: <LuCheck size={18} className="text-emerald-600" />,
        });
        setTimeout(() => {
          router.push("/user/task/list");
        }, 1200);
      } else {
        toast.error(data.message || "Nộp bài thất bại!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi kết nối khi gửi tệp tin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <LuLoader className="h-8 w-8 animate-spin text-main" />
        <p className="text-xs text-slate-400">Đang tải thông tin nhiệm vụ...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <LuTriangleAlert size={36} className="text-rose-500" />
        <h2 className="text-base font-bold text-slate-800">Không tìm thấy thông tin nhiệm vụ</h2>
        <p className="text-xs text-slate-500">Nhiệm vụ có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
        <Link
          href="/user/task/list"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-main/90 transition"
        >
          <LuArrowLeft size={14} />
          Quay lại danh sách nhiệm vụ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <Link
        href="/user/task/list"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-main transition mb-4 cursor-pointer"
      >
        <LuArrowLeft size={14} />
        Quay lại danh sách nhiệm vụ
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* Task Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-main font-mono text-xs font-bold">
                <LuFolder size={14} />
              </span>
              <span className="font-bold text-main font-mono text-xs">{task.taskCode}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-slate-600">{task.category || "Chung"}</span>
            </div>
            <h1 className="mt-2 text-lg font-bold text-text">{task.title}</h1>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <LuCalendar size={14} className="text-slate-400" />
            <span>Hạn nộp: {task.deadline || "Không có hạn"}</span>
          </div>
        </div>

        {task.description && (
          <div className="mt-4 rounded-xl bg-slate-50/70 p-3.5 text-xs text-slate-600 leading-relaxed border border-slate-100">
            <p className="font-semibold text-slate-700 mb-1">Mô tả yêu cầu:</p>
            <p>{task.description}</p>
          </div>
        )}

        {/* Form nộp bài */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tệp tin đính kèm bài làm <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:border-main transition-colors">
              <input
                type="file"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-main">
                  <LuFileText size={20} />
                  <span className="truncate max-w-[320px]">{file.name}</span>
                  <span className="text-slate-400 font-normal">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <LuUpload size={26} className="text-main" />
                  <p className="text-xs font-medium text-slate-600">
                    Nhấp hoặc kéo thả tệp tài liệu vào đây để tải lên
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hỗ trợ ZIP, RAR, PDF, DOCX, XLSX, hình ảnh, mã nguồn...
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ghi chú gửi tới Quản trị viên (tùy chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú chi tiết về bài nộp hoặc lời nhắn..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-text outline-none placeholder:text-slate-400 focus:border-main focus:ring-1 focus:ring-main"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/user/task/list"
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="flex items-center gap-1.5 rounded-xl bg-main px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-main/90 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <LuLoader className="animate-spin text-white text-xs" />
              ) : (
                <LuCheck size={14} />
              )}
              {isSubmitting ? "Đang tải lên..." : "Xác nhận nộp bài"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserTaskSubmitPage() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LuLoader className="h-8 w-8 animate-spin text-main" />
            <p className="text-xs text-slate-400">Đang tải trang...</p>
          </div>
        }
      >
        <TaskSubmitContent />
      </Suspense>
    </>
  );
}
