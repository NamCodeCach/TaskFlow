"use client";

import { useState } from "react";
import { LuTrash2, LuLoader, LuTriangleAlert, LuX } from "react-icons/lu";
import { toast } from "sonner";
import { taskService, TaskItem } from "@/src/app/services/taskService";

interface DeleteTaskModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onSuccess: (deletedId: number) => void;
}

export const DeleteTaskModal = ({ isOpen, task, onClose, onSuccess }: DeleteTaskModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await taskService.delete(task.id);
      if (res.code === "success") {
        toast.success(`Đã xóa nhiệm vụ "${task.taskCode}: ${task.title}" thành công!`);
        onSuccess(task.id);
        onClose();
      } else {
        toast.error(res.message || "Xóa nhiệm vụ thất bại!");
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối đến máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] rounded-[20px] bg-white p-6 shadow-2xl border border-slate-100">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
        >
          <LuX size={18} />
        </button>

        {/* Biểu tượng cảnh báo */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <LuTriangleAlert size={24} />
        </div>

        {/* Tiêu đề & Nội dung */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Xóa nhiệm vụ</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Bạn có chắc chắn muốn xóa nhiệm vụ{" "}
            <strong className="text-slate-800 font-semibold">{task.taskCode}</strong> - "
            <span className="text-slate-700">{task.title}</span>"?
          </p>
          <p className="flex items-center justify-center gap-1 text-[11px] text-red-500 mt-2 font-medium">
            <LuTriangleAlert size={13} className="shrink-0 text-red-500" />
            <span>Thao tác này sẽ xóa vĩnh viễn nhiệm vụ và toàn bộ bài nộp liên quan!</span>
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? <LuLoader className="animate-spin text-sm" /> : <LuTrash2 size={15} />}
            <span>{isLoading ? "Đang xóa..." : "Xác nhận xóa"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
