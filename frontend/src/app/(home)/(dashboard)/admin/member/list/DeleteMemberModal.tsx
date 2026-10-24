"use client";

import { useState } from "react";
import { LuTrash2, LuLoader, LuTriangleAlert, LuX } from "react-icons/lu";
import { toast } from "sonner";
import { memberService, Member } from "@/src/app/services/memberService";

interface DeleteMemberModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onSuccess: (deletedId: number) => void;
}

export const DeleteMemberModal = ({ isOpen, member, onClose, onSuccess }: DeleteMemberModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !member) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await memberService.delete(member.id);
      if (res.code === "success") {
        toast.success(`Đã xóa thành viên "${member.fullName}" khỏi hệ thống!`);
        onSuccess(member.id);
        onClose();
      } else {
        toast.error(res.message || "Xóa thành viên thất bại!");
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
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <LuX size={18} />
        </button>

        {/* Biểu tượng cảnh báo */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <LuTriangleAlert size={24} />
        </div>

        {/* Tiêu đề & Nội dung */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Xóa tài khoản thành viên</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Bạn có chắc chắn muốn xóa tài khoản của thành viên{" "}
            <strong className="text-slate-800 font-semibold">{member.fullName}</strong> (
            <span className="font-mono text-slate-700">{member.email}</span>)?
          </p>
          <p className="text-[11px] text-red-500 mt-2 font-medium">
            ⚠️ Thao tác này sẽ xóa vĩnh viễn tài khoản và không thể hoàn tác!
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
