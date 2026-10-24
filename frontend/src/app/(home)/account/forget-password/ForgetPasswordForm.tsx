"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import { LuLoader } from "react-icons/lu";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { authService } from "@/src/app/services/authService";

export const ForgetPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Khóa chống submit 2 lần liên tiếp (double click)
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Vui lòng nhập email của bạn!");
      return;
    }

    // Kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Định dạng email không hợp lệ!");
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(trimmedEmail);

      if (res.code === "success") {
        // Lưu email vào sessionStorage để bước nhập OTP đối chiếu
        sessionStorage.setItem("taskflow_reset_email", trimmedEmail);
        sessionStorage.removeItem("taskflow_dev_otp");
        sessionStorage.removeItem("taskflow_reset_otp");

        // Thông báo cho người dùng kiểm tra email cá nhân
        toast.success("Mã OTP đã được gửi về email của bạn! Vui lòng kiểm tra hộp thư (cả mục Spam).", {
          duration: 5000,
        });

        // Chuyển hướng sang bước xác nhận OTP
        setTimeout(() => {
          router.push("/account/otp");
        }, 1200);
      } else {
        toast.error(res.message || "Không thể gửi yêu cầu đặt lại mật khẩu!");
      }
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit} className="mt-[28px] flex flex-col gap-[20px]">
        {/* Email */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="email-user" className="text-[#475569] text-[14px] font-medium">
            Email tài khoản
          </label>
          <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[12px] focus-within:border-main transition-colors">
            <MdOutlineEmail className="text-gray-400 text-[20px] shrink-0" />
            <input
              type="email"
              name="email-user"
              id="email-user"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nguyenvana@taskflow.vn"
              className="w-full outline-none text-sm text-slate-700 bg-transparent disabled:opacity-60"
            />
          </div>
        </div>
        {/* End Email */}

        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center items-center gap-2 py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-[0px_4px_12px_rgba(37,99,235,0.2)]"
        >
          {isLoading && <LuLoader className="animate-spin text-lg" />}
          <span>{isLoading ? "Đang gửi mã..." : "Gửi mã xác nhận"}</span>
        </button>

        <div className="text-center mt-2">
          <Link
            href="/account/login"
            className="text-[14px] text-main hover:underline font-medium"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </>
  );
};
