"use client";

import { useEffect, useState } from "react";
import JustValidate from "just-validate";
import { LuX, LuUser, LuPhone, LuLockKeyhole, LuLoader } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";
import { memberService, Member } from "@/src/app/services/memberService";

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: Member) => void;
}

export const CreateMemberModal = ({ isOpen, onClose, onSuccess }: CreateMemberModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Khởi tạo JustValidate khi mở Modal
    const validator = new JustValidate("#form-create-member", {
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#fullName", [
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
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập email",
        },
        {
          rule: "email",
          errorMessage: "Email không đúng định dạng",
        },
      ])
      .addField("#phone", [
        {
          rule: "customRegexp",
          value: /^(0[0-9]{9})?$/,
          errorMessage: "Số điện thoại phải có 10 chữ số bắt đầu bằng 0",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mật khẩu",
        },
        {
          rule: "minLength",
          value: 8,
          errorMessage: "Mật khẩu phải có tối thiểu 8 ký tự",
        },
        {
          validator: (value: string) => {
            // Mật khẩu đủ mạnh: chữ hoa, chữ thường, số, ký tự đặc biệt
            const strongRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
            return strongRegex.test(value);
          },
          errorMessage: "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%...)",
        },
      ])
      .onSuccess(async (event: any) => {
        setIsLoading(true);

        const form = event.target;
        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim() || undefined;
        const password = form.password.value;
        const role = form.role.value;

        try {
          const res = await memberService.create({
            fullName,
            email,
            password,
            phone,
            role,
          });

          if (res.code === "success" && res.data) {
            toast.success(`Cấp tài khoản cho "${fullName}" thành công!`);
            onSuccess(res.data);
            onClose();
          } else {
            toast.error(res.message || "Cấp tài khoản thất bại!");
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
  }, [isOpen, onClose, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[500px] rounded-[20px] bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
        {/* Nút đóng modal */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <LuX size={20} />
        </button>

        {/* Tiêu đề Modal */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Cấp tài khoản thành viên mới</h2>
          <p className="text-xs text-slate-500 mt-1">
            Điền thông tin thành viên để cấp quyền truy cập hệ thống TaskFlow.
          </p>
        </div>

        {/* Form cấp tài khoản với JustValidate */}
        <form id="form-create-member" autoComplete="off" className="space-y-5">
          {/* Họ và tên */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <LuUser className="text-slate-400 shrink-0" size={17} />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Ví dụ: Nguyễn Văn A"
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <MdOutlineEmail className="text-slate-400 shrink-0 text-[18px]" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="nguyenvana@taskflow.vn"
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số điện thoại <span className="text-slate-400 font-normal">(Tùy chọn)</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <LuPhone className="text-slate-400 shrink-0" size={17} />
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="0912345678"
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mật khẩu khởi tạo <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <LuLockKeyhole className="text-slate-400 shrink-0" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Tối thiểu 8 ký tự, chữ hoa, số & ký tự đặc biệt"
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
              </button>
            </div>
          </div>

          {/* Vai trò */}
          <div>
            <label htmlFor="role" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vai trò hệ thống <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              defaultValue="user"
              disabled={isLoading}
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
              <span>{isLoading ? "Đang xử lý..." : "Cấp tài khoản"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
