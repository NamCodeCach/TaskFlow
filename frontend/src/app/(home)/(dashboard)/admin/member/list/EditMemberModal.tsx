"use client";

import { useEffect, useState } from "react";
import JustValidate from "just-validate";
import { LuX, LuUser, LuPhone, LuLoader } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import { memberService, Member } from "@/src/app/services/memberService";

interface EditMemberModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onSuccess: (updatedMember: Member) => void;
}

export const EditMemberModal = ({ isOpen, member, onClose, onSuccess }: EditMemberModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (member) {
      setFullName(member.fullName || "");
      setPhone(member.phone || "");
      setRole(member.role?.toLowerCase() || "user");
    }
  }, [member]);

  useEffect(() => {
    if (!isOpen || !member) return;

    const validator = new JustValidate("#form-edit-member", {
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#editFullName", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập họ và tên",
        },
        {
          rule: "minLength",
          value: 2,
          errorMessage: "Họ và tên phải có ít nhất 2 ký tự",
        },
      ])
      .addField("#editPhone", [
        {
          rule: "customRegexp",
          value: /^(0[0-9]{9})?$/,
          errorMessage: "Số điện thoại phải có 10 chữ số bắt đầu bằng 0",
        },
      ])
      .onSuccess(async (event: any) => {
        setIsLoading(true);
        const form = event.target;
        const newFullName = form.editFullName.value.trim();
        const newPhone = form.editPhone.value.trim() || undefined;
        const newRole = form.editRole.value;

        try {
          const res = await memberService.update(member.id, {
            fullName: newFullName,
            phone: newPhone,
            role: newRole,
          });

          if (res.code === "success" && res.data) {
            toast.success(`Cập nhật thông tin thành viên "${newFullName}" thành công!`);
            onSuccess(res.data);
            onClose();
          } else {
            toast.error(res.message || "Cập nhật thành viên thất bại!");
          }
        } catch (err: any) {
          toast.error(err.message || "Không thể kết nối đến máy chủ!");
        } finally {
          setIsLoading(false);
        }
      });

    return () => {
      validator.destroy();
    };
  }, [isOpen, member, onClose, onSuccess]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[480px] rounded-[20px] bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <LuX size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa thông tin thành viên</h2>
          <p className="text-xs text-slate-500 mt-1">
            Thay đổi họ và tên, số điện thoại hoặc vai trò của tài khoản.
          </p>
        </div>

        <form id="form-edit-member" autoComplete="off" className="space-y-5">
          {/* Email (Chỉ đọc) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email đăng nhập <span className="text-slate-400 font-normal">(Cố định)</span>
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <MdOutlineEmail className="text-slate-400 shrink-0 text-[18px]" />
              <input
                type="email"
                disabled
                value={member.email}
                className="w-full bg-transparent text-sm text-slate-500 outline-none cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Họ và tên */}
          <div>
            <label htmlFor="editFullName" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <LuUser className="text-slate-400 shrink-0" size={17} />
              <input
                type="text"
                id="editFullName"
                name="editFullName"
                disabled={isLoading}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Lê Trần Hoàng Nam"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="editPhone" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số điện thoại <span className="text-slate-400 font-normal">(Tùy chọn)</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <LuPhone className="text-slate-400 shrink-0" size={17} />
              <input
                type="text"
                id="editPhone"
                name="editPhone"
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Vai trò */}
          <div>
            <label htmlFor="editRole" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vai trò hệ thống <span className="text-red-500">*</span>
            </label>
            <select
              id="editRole"
              name="editRole"
              disabled={isLoading}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-main cursor-pointer"
            >
              <option value="user">Thành viên (Member)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-main px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-main/90 transition disabled:opacity-60 cursor-pointer"
            >
              {isLoading && <LuLoader className="animate-spin text-sm" />}
              <span>{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
