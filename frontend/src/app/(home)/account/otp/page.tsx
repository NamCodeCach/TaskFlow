"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaListCheck, FaClock } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { LuKeyRound, LuLoader } from "react-icons/lu";
import { toast, Toaster } from "sonner";
import { authService } from "@/src/app/services/authService";

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(300); // 5 phút = 300 giây
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    // 1. Dọn dẹp triệt để bất kỳ mã OTP lưu tạm nào trong sessionStorage
    sessionStorage.removeItem("taskflow_dev_otp");
    setOtp("");

    // 2. Kiểm tra xem người dùng đã nhập email ở bước trước chưa
    const storedEmail = sessionStorage.getItem("taskflow_reset_email");
    if (!storedEmail) {
      toast.error("Vui lòng nhập email trước khi xác minh OTP!");
      router.replace("/account/forget-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  // Bộ đếm ngược thời gian hết hạn OTP (5 phút)
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chống submit 2 lần
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      toast.error("Vui lòng nhập mã OTP!");
      return;
    }
    if (cleanOtp.length !== 6) {
      toast.error("Mã OTP phải bao gồm đúng 6 chữ số!");
      return;
    }
    if (countdown === 0) {
      toast.error("Mã OTP đã hết hạn! Vui lòng bấm 'Gửi lại mã OTP'.");
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(email, cleanOtp);

      if (res.code === "success") {
        toast.success("Xác thực OTP thành công!");
        // Lưu mã OTP đã xác thực để dùng ở bước đổi mật khẩu
        sessionStorage.setItem("taskflow_reset_otp", cleanOtp);

        setTimeout(() => {
          router.push("/account/change-password");
        }, 800);
      } else {
        toast.error(res.message || "Mã OTP không chính xác!");
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối đến máy chủ!");
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.code === "success") {
        setCountdown(300); // Đặt lại 5 phút
        setOtp(""); // Xóa ô nhập để người dùng dán mã mới
        toast.success("Mã OTP mới đã được gửi về email của bạn! Vui lòng kiểm tra hộp thư.");
      } else {
        toast.error(res.message || "Không thể gửi lại mã OTP!");
      }
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi khi gửi lại OTP!");
    } finally {
      setIsResending(false);
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

            <h3 className="text-[26px] font-bold text-text text-center">Xác minh mã OTP</h3>

            <p className="text-[14px] text-[#475569] text-center mt-2">
              Nhập mã 6 chữ số đã gửi đến email{" "}
              <span className="font-semibold text-slate-800">{email || "..."}</span>
            </p>

            {/* Form OTP */}
            <form onSubmit={handleVerifyOtp} autoComplete="off" className="mt-[28px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="otp-input" className="text-[#475569] text-[14px] font-medium">
                  Mã xác thực OTP
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[12px] focus-within:border-main transition-colors">
                  <LuKeyRound className="text-gray-400 text-[20px] shrink-0" />
                  <input
                    type="text"
                    id="otp-input"
                    name="otp-input"
                    maxLength={6}
                    required
                    autoComplete="off"
                    disabled={isLoading}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder=""
                    className="w-full outline-none text-center text-lg tracking-[0.3em] font-semibold text-slate-800 bg-transparent disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Countdown & Resend */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <FaClock className="text-xs" />
                  <span>
                    Hết hạn sau:{" "}
                    <span className={countdown <= 60 ? "font-bold text-red-500" : "font-semibold text-main"}>
                      {formatCountdown(countdown)}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-main hover:underline text-xs font-semibold disabled:opacity-50"
                >
                  {isResending ? "Đang gửi..." : "Gửi lại mã"}
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex justify-center items-center gap-2 py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-[0px_4px_12px_rgba(37,99,235,0.2)]"
              >
                {isLoading && <LuLoader className="animate-spin text-lg" />}
                <span>{isLoading ? "Đang xác thực..." : "Xác nhận OTP"}</span>
              </button>

              <div className="text-center mt-1">
                <Link
                  href="/account/forget-password"
                  className="text-[13px] text-slate-500 hover:text-main font-medium"
                >
                  ← Đổi email khác
                </Link>
              </div>
            </form>

            {/* Note info */}
            <div className="flex items-center justify-center gap-[12px] p-[16px] rounded-[12px] bg-[#F8FAFC] text-[13px] text-[#475569] font-light mt-[24px]">
              <IoMdInformationCircleOutline className="h-[24px] w-[24px] shrink-0 text-main" />
              <p>Mã OTP có thời hạn 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
