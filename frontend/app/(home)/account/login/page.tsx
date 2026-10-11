"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaListCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { LuLockKeyhole } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Thông báo lỗi & thành công
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Số lần nhập sai & Khóa 1 phút khi sai 5 lần
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  // Đọc dữ liệu khóa & kiểm tra URL query khi vào trang
  useEffect(() => {
    // Luôn đảm bảo ô nhập trống hoàn toàn khi tải trang
    setEmail("");
    setPassword("");

    // Kiểm tra nếu vừa đăng ký thành công chuyển về
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "success") {
        setSuccessMessage("Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.");
      }

      // Đọc trạng thái khóa từ localStorage
      const savedLock = localStorage.getItem("taskflow_lock_until");
      const savedAttempts = localStorage.getItem("taskflow_failed_attempts");

      if (savedAttempts) {
        setFailedAttempts(parseInt(savedAttempts, 10));
      }

      if (savedLock) {
        const lockTime = parseInt(savedLock, 10);
        if (lockTime > Date.now()) {
          setLockUntil(lockTime);
          setIsLocked(true);
          setCountdown(Math.ceil((lockTime - Date.now()) / 1000));
        } else {
          localStorage.removeItem("taskflow_lock_until");
          localStorage.removeItem("taskflow_failed_attempts");
        }
      }
    }
  }, []);

  // Bộ đếm ngược khi bị khóa 1 phút (60 giây)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLocked && lockUntil > Date.now()) {
      timer = setInterval(() => {
        const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          setCountdown(0);
          setFailedAttempts(0);
          setErrorMessage(null);
          localStorage.removeItem("taskflow_lock_until");
          localStorage.removeItem("taskflow_failed_attempts");
          clearInterval(timer);
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isLocked, lockUntil]);

  // Xử lý đăng nhập
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Kiểm tra nếu đang bị khóa
    if (isLocked && lockUntil > Date.now()) {
      setErrorMessage(
        `Tài khoản đang bị tạm khóa do nhập sai 5 lần. Vui lòng đợi ${countdown} giây để thử lại!`
      );
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const inputPassword = password;

    if (!trimmedEmail) {
      setErrorMessage("Vui lòng nhập địa chỉ Gmail!");
      return;
    }

    if (!inputPassword) {
      setErrorMessage("Vui lòng nhập mật khẩu!");
      return;
    }

    // Lấy danh sách tài khoản từ localStorage
    const storedUsersStr = localStorage.getItem("taskflow_users");
    const registeredUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];

    // Thêm sẵn tài khoản mặc định demo hệ thống (Chỉ DUY NHẤT 1 Quản trị viên)
    const defaultAccounts = [
      {
        fullName: "Lê Trần Hoàng Nam",
        email: "nam.nguyen@taskflow.vn",
        password: "Pass@123",
        role: "admin",
      },
      {
        fullName: "Nguyễn Võ Anh Kiệt",
        email: "kiet.nguyen@taskflow.vn",
        password: "Pass@123",
        role: "user",
      },
    ];

    const allUsers = [...registeredUsers, ...defaultAccounts];

    // Tìm tài khoản theo email
    const user = allUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      setErrorMessage("Tài khoản Gmail này không tồn tại trên hệ thống. Vui lòng kiểm tra lại!");
      return;
    }

    // Kiểm tra mật khẩu
    if (user.password !== inputPassword) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      localStorage.setItem("taskflow_failed_attempts", nextAttempts.toString());

      if (nextAttempts >= 5) {
        // Khóa trong 1 phút (60 giây = 60000ms)
        const lockTime = Date.now() + 60 * 1000;
        setLockUntil(lockTime);
        setIsLocked(true);
        setCountdown(60);
        localStorage.setItem("taskflow_lock_until", lockTime.toString());
        setErrorMessage(
          "⚠️ Bạn đã nhập sai mật khẩu 5 lần! Tài khoản tạm thời bị khóa trong 1 phút (60 giây)."
        );
      } else {
        const remainingTries = 5 - nextAttempts;
        setErrorMessage(
          `Mật khẩu không chính xác! Bạn còn ${remainingTries} lần thử trước khi bị khóa tạm thời 1 phút.`
        );
      }
      return;
    }

    // Đăng nhập thành công -> Reset số lần sai
    const userRole = user.role || "user";
    localStorage.removeItem("taskflow_lock_until");
    localStorage.removeItem("taskflow_failed_attempts");
    localStorage.setItem(
      "taskflow_current_user",
      JSON.stringify({
        fullName: user.fullName,
        email: user.email,
        role: userRole,
        loggedInAt: new Date().toISOString(),
      })
    );

    // Chuyển hướng phân quyền
    if (userRole === "admin") {
      router.push("/admin/member/list");
    } else {
      router.push("/user/task/list");
    }
  };

  return (
    <>
      <div className="my-[40px] md:my-[80px]">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[32px] sm:p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[26px] sm:text-[28px] font-bold text-text text-center mt-[24px]">
              Chào mừng trở lại
            </h3>

            <p className="text-[14px] text-[#475569] text-center font-[400] mt-1">
              Đăng nhập để cùng nhóm biến kế hoạch thành kết quả.
            </p>

            {/* Thông báo đăng ký thành công */}
            {successMessage && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium text-center">
                ✓ {successMessage}
              </div>
            )}

            {/* Cảnh báo khóa tài khoản 1 phút */}
            {isLocked && (
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 text-amber-800 text-xs rounded-xl font-medium text-center flex flex-col gap-1 animate-pulse">
                <span className="font-bold text-[13px]">🔒 TÀI KHOẢN TẠM KHÓA TRONG 1 PHÚT</span>
                <span>
                  Bạn đã nhập sai 5 lần liên tiếp. Vui lòng chờ:{" "}
                  <strong className="text-red-600 text-[14px]">{countdown}s</strong>
                </span>
              </div>
            )}

            {/* Thông báo lỗi */}
            {errorMessage && !isLocked && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
                {errorMessage}
              </div>
            )}

            {/* Form Login */}
            <form
              onSubmit={handleLogin}
              autoComplete="off"
              noValidate
              className="mt-[24px] flex flex-col gap-[20px]"
            >
              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email-user" className="text-[#475569] text-[14px] font-medium">
                  Email
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[13px] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20">
                  <MdOutlineEmail className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="email"
                    name="taskflow_user_email"
                    id="email-user"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    disabled={isLocked}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full outline-none text-sm text-slate-700 disabled:bg-transparent disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password-user" className="text-[#475569] text-[14px] font-medium">
                  Mật khẩu
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[13px] text-[#94A3B8] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20">
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="taskflow_user_password"
                    id="password-user"
                    required
                    autoComplete="new-password"
                    disabled={isLocked}
                    value={password}
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full outline-none text-sm text-slate-700 disabled:bg-transparent disabled:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex w-full justify-between items-center flex-wrap gap-2">
                <div className="flex gap-[8px] items-center">
                  <input
                    type="checkbox"
                    id="remember-password"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-main h-4 w-4"
                  />
                  <label
                    htmlFor="remember-password"
                    className="text-[#475569] text-[14px] cursor-pointer"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  href="/account/forget-password"
                  className="text-main text-[14px] font-medium hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLocked}
                className={`flex justify-center items-center py-[14px] w-full rounded-[12px] text-white font-bold transition shadow-sm ${
                  isLocked
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-main hover:opacity-95 cursor-pointer"
                }`}
              >
                {isLocked ? `Đang khóa (${countdown}s)` : "Đăng nhập"}
              </button>

              {/* Chuyển sang Đăng ký */}
              <div className="flex items-center justify-center text-[#475569] text-[14px] gap-[6px] flex-wrap text-center mt-1">
                <span>Chưa có tài khoản?</span>
                <Link
                  href="/account/register"
                  className="font-semibold text-main hover:underline transition"
                >
                  Đăng ký tài khoản
                </Link>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 text-[13px]">Liên hệ quản trị viên</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
