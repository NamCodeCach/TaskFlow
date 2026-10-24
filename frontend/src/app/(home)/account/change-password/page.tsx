"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaListCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { LuLockKeyhole, LuLoader } from "react-icons/lu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { toast, Toaster } from "sonner";
import { authService } from "@/src/app/services/authService";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra xem đã qua bước xác thực email & OTP chưa
    const storedEmail = sessionStorage.getItem("taskflow_reset_email");
    const storedOtp = sessionStorage.getItem("taskflow_reset_otp");

    if (!storedEmail || !storedOtp) {
      toast.error("Vui lòng hoàn thành bước xác thực OTP trước!");
      router.replace("/account/forget-password");
      return;
    }

    setEmail(storedEmail);
    setOtp(storedOtp);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email, otp, password);

      if (res.code === "success") {
        // Dọn dẹp dữ liệu tạm trong sessionStorage
        sessionStorage.removeItem("taskflow_reset_email");
        sessionStorage.removeItem("taskflow_reset_otp");
        sessionStorage.removeItem("taskflow_dev_otp");

        toast.success("Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...");

        setTimeout(() => {
          router.push("/account/login");
        }, 1200);
      } else {
        toast.error(res.message || "Đặt lại mật khẩu thất bại!");
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối đến máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="m-[60px] md:m-[100px]">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[32px] md:p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* Header / Logo */}
            <div className="flex items-center justify-center gap-3 mb-[24px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[26px] font-bold text-text text-center">Đặt lại mật khẩu mới</h3>
            <p className="text-[14px] text-[#475569] text-center mt-2">
              Tài khoản: <span className="font-semibold text-slate-800">{email || "..."}</span>
            </p>

            {/* Form thay đổi mật khẩu */}
            <form onSubmit={handleSubmit} className="mt-[28px] flex flex-col gap-[20px]">
              {/* Mật khẩu mới */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="new-password" className="text-[#475569] text-[14px] font-medium">
                  Mật khẩu mới
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[12px] focus-within:border-main transition-colors">
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new-password"
                    id="new-password"
                    required
                    minLength={6}
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full outline-none text-sm text-slate-700 bg-transparent disabled:opacity-60"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaRegEye className="text-[18px]" />
                    ) : (
                      <FaRegEyeSlash className="text-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="flex flex-col gap-[8px]">
                <label
                  htmlFor="confirm-password"
                  className="text-[#475569] text-[14px] font-medium"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[12px] focus-within:border-main transition-colors">
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm-password"
                    id="confirm-password"
                    required
                    minLength={6}
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full outline-none text-sm text-slate-700 bg-transparent disabled:opacity-60"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FaRegEye className="text-[18px]" />
                    ) : (
                      <FaRegEyeSlash className="text-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex justify-center items-center gap-2 py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-[0px_4px_12px_rgba(37,99,235,0.2)] mt-2"
              >
                {isLoading && <LuLoader className="animate-spin text-lg" />}
                <span>{isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}</span>
              </button>

              <div className="text-center mt-1">
                <Link
                  href="/account/login"
                  className="text-[13px] text-slate-500 hover:text-main font-medium"
                >
                  ← Hủy và quay lại đăng nhập
                </Link>
              </div>
            </form>

            {/* Note info */}
            <div className="flex items-center justify-center gap-[12px] p-[16px] rounded-[12px] bg-[#F8FAFC] text-[13px] text-[#475569] font-light mt-[24px]">
              <IoMdInformationCircleOutline className="h-[24px] w-[24px] shrink-0 text-main" />
              <p>
                Mật khẩu mới sẽ được mã hóa an toàn và áp dụng ngay cho lần đăng nhập tiếp theo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
