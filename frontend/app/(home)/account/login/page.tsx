"use client";

import { apiPost } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaListCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { LuCheck, LuKeyRound, LuLock, LuLockKeyhole, LuShieldAlert, LuUserCheck, LuX } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

interface UserAccount {
  fullName: string;
  email: string;
  password?: string;
  role?: string;
  mustChangePassword?: boolean;
}

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

  // =========================================================================
  // STATE ĐỔI MẬT KHẨU LẦN ĐẦU (CHO TÀI KHOẢN ĐƯỢC CẤP MẬT KHẨU TẠM THỜI)
  // =========================================================================
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [firstTimeNewPass, setFirstTimeNewPass] = useState("");
  const [firstTimeConfirmPass, setFirstTimeConfirmPass] = useState("");
  const [showFirstTimeNewPass, setShowFirstTimeNewPass] = useState(false);
  const [showFirstTimeConfirmPass, setShowFirstTimeConfirmPass] = useState(false);
  const [firstTimeError, setFirstTimeError] = useState<string | null>(null);

  // Đọc dữ liệu khóa khi vào trang
  useEffect(() => {
    setEmail("");
    setPassword("");

    if (typeof window !== "undefined") {
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
  const handleLogin = async (e: React.FormEvent) => {
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
      setErrorMessage("Vui lòng nhập địa chỉ Email!");
      return;
    }

    if (!inputPassword) {
      setErrorMessage("Vui lòng nhập mật khẩu!");
      return;
    }

    // =========================================================================
    // BƯỚC 1: Thử đăng nhập qua API backend (Spring Boot + SQL Server)
    // =========================================================================
    try {
      const user = await apiPost<UserAccount>("/users/login", {
        email: trimmedEmail,
        password: inputPassword,
      });

      // Đăng nhập backend thành công → reset đếm sai
      localStorage.removeItem("taskflow_lock_until");
      localStorage.removeItem("taskflow_failed_attempts");

      if (user.mustChangePassword) {
        setPendingUser(user);
        setFirstTimeNewPass("");
        setFirstTimeConfirmPass("");
        setFirstTimeError(null);
        setShowFirstTimeModal(true);
        return;
      }

      completeSuccessfulLogin(user);
      return;
    } catch (apiErr: any) {
      // Nếu lỗi là "network error" / "Failed to fetch" → backend chưa chạy → fallback localStorage
      const isNetworkErr =
        apiErr?.message?.includes("fetch") ||
        apiErr?.message?.includes("Network") ||
        apiErr?.message?.includes("Failed") ||
        apiErr?.message?.includes("ERR_CONNECTION");

      if (!isNetworkErr) {
        // Lỗi từ backend (sai mật khẩu, không tồn tại...)
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        localStorage.setItem("taskflow_failed_attempts", nextAttempts.toString());

        if (nextAttempts >= 5) {
          const lockTime = Date.now() + 60 * 1000;
          setLockUntil(lockTime);
          setIsLocked(true);
          setCountdown(60);
          localStorage.setItem("taskflow_lock_until", lockTime.toString());
          setErrorMessage("⚠️ Bạn đã nhập sai mật khẩu 5 lần! Tài khoản tạm thời bị khóa trong 1 phút (60 giây).");
        } else {
          const remainingTries = 5 - nextAttempts;
          setErrorMessage(
            `${apiErr.message} (Còn ${remainingTries} lần thử)`
          );
        }
        return;
      }
      // Nếu là network error → tiếp tục fallback sang localStorage bên dưới
    }

    // =========================================================================
    // BƯỚC 2: Fallback – đọc từ localStorage khi backend chưa chạy
    // =========================================================================
    // 1. Tài khoản mặc định demo hệ thống (Chỉ 1 Quản trị viên duy nhất)
    const defaultAccounts: UserAccount[] = [
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

    const allUsersMap: Record<string, UserAccount> = {};
    defaultAccounts.forEach((u) => {
      allUsersMap[u.email.toLowerCase().trim()] = u;
    });

    // 2. Đọc từ danh sách thành viên taskflow_members_list
    const membersListStr = localStorage.getItem("taskflow_members_list");
    if (membersListStr) {
      try {
        const members = JSON.parse(membersListStr);
        if (Array.isArray(members)) {
          members.forEach((m: any) => {
            if (m && m.email) {
              const emailKey = m.email.toLowerCase().trim();
              allUsersMap[emailKey] = {
                fullName: m.name,
                email: m.email,
                password: m.password || "Pass@123",
                role: m.admin ? "admin" : "user",
                mustChangePassword: m.mustChangePassword ?? false,
              };
            }
          });
        }
      } catch {}
    }

    // 3. Đọc từ taskflow_users (Ưu tiên cao nhất)
    const storedUsersStr = localStorage.getItem("taskflow_users");
    if (storedUsersStr) {
      try {
        const registeredUsers = JSON.parse(storedUsersStr);
        if (Array.isArray(registeredUsers)) {
          registeredUsers.forEach((u: any) => {
            if (u && u.email) {
              allUsersMap[u.email.toLowerCase().trim()] = u;
            }
          });
        }
      } catch {}
    }

    const user = allUsersMap[trimmedEmail];

    if (!user) {
      setErrorMessage("Tài khoản này không tồn tại trên hệ thống. Vui lòng kiểm tra lại hoặc liên hệ Quản trị viên!");
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

    // Đăng nhập đúng thông tin -> Reset bộ đếm số lần sai
    localStorage.removeItem("taskflow_lock_until");
    localStorage.removeItem("taskflow_failed_attempts");

    // =========================================================================
    // NẾU TÀI KHOẢN ĐANG CÓ CỜ "BẮT BUỘC ĐỔI MẬT KHẨU LẦN ĐẦU" (mustChangePassword)
    // =========================================================================
    if (user.mustChangePassword) {
      setPendingUser(user);
      setFirstTimeNewPass("");
      setFirstTimeConfirmPass("");
      setFirstTimeError(null);
      setShowFirstTimeModal(true);
      return;
    }

    // Nếu không yêu cầu đổi mật khẩu -> Cho vào hệ thống bình thường
    completeSuccessfulLogin(user);
  };


  // Hoàn tất lưu phiên đăng nhập và chuyển hướng
  const completeSuccessfulLogin = (user: UserAccount) => {
    const userRole = user.role || "user";
    const emailKey = user.email.trim().toLowerCase();

    let userDob = "";
    let isDobLocked = false;
    let userAddress = "";
    let isAddressLocked = false;
    let userPhone = "";

    try {
      const dStr = localStorage.getItem("taskflow_user_dobs");
      if (dStr) {
        const dMap = JSON.parse(dStr);
        if (dMap[emailKey]) {
          userDob = dMap[emailKey].dob || "";
          isDobLocked = dMap[emailKey].isLocked ?? false;
        }
      }
    } catch {}

    try {
      const aStr = localStorage.getItem("taskflow_user_addresses");
      if (aStr) {
        const aMap = JSON.parse(aStr);
        if (aMap[emailKey]) {
          userAddress = aMap[emailKey].address || "";
          isAddressLocked = aMap[emailKey].isLocked ?? false;
        }
      }
    } catch {}

    try {
      const pStr = localStorage.getItem("taskflow_user_phones");
      if (pStr) {
        const pMap = JSON.parse(pStr);
        if (pMap[emailKey]) userPhone = pMap[emailKey];
      }
    } catch {}

    try {
      const uStr = localStorage.getItem("taskflow_users");
      if (uStr) {
        const uList = JSON.parse(uStr);
        if (Array.isArray(uList)) {
          const matched = uList.find((x: any) => x?.email && x.email.trim().toLowerCase() === emailKey);
          if (matched) {
            if (!userDob && matched.dob) userDob = matched.dob;
            if (matched.isDobLocked !== undefined) isDobLocked = matched.isDobLocked;
            if (!userAddress && matched.address) userAddress = matched.address;
            if (matched.isAddressLocked !== undefined) isAddressLocked = matched.isAddressLocked;
            if (!userPhone && matched.phone) userPhone = matched.phone;
          }
        }
      }
    } catch {}

    localStorage.setItem(
      "taskflow_current_user",
      JSON.stringify({
        fullName: user.fullName,
        email: user.email,
        role: userRole,
        dob: userDob,
        isDobLocked,
        address: userAddress,
        isAddressLocked,
        phone: userPhone,
        loggedInAt: new Date().toISOString(),
      })
    );

    if (userRole === "admin") {
      router.push("/admin/member/list");
    } else {
      router.push("/user/task/list");
    }
  };

  // =========================================================================
  // XỬ LÝ NỘP FORM ĐỔI MẬT KHẨU LẦN ĐẦU
  // =========================================================================
  const handleConfirmFirstTimePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFirstTimeError(null);

    if (!pendingUser) return;

    if (!firstTimeNewPass || firstTimeNewPass.length < 6) {
      setFirstTimeError("Mật khẩu mới phải có tối thiểu 6 ký tự!");
      return;
    }

    if (firstTimeNewPass !== firstTimeConfirmPass) {
      setFirstTimeError("Xác nhận mật khẩu không khớp với mật khẩu mới!");
      return;
    }

    if (firstTimeNewPass === password) {
      setFirstTimeError("Mật khẩu mới không được trùng với mật khẩu tạm thời cũ!");
      return;
    }

    // Cập nhật lại mật khẩu mới & gỡ bỏ cờ mustChangePassword trong taskflow_users
    try {
      const storedUsersStr = localStorage.getItem("taskflow_users");
      let users: UserAccount[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      
      const idx = users.findIndex(
        (u) => u.email.toLowerCase() === pendingUser.email.toLowerCase()
      );

      if (idx !== -1) {
        users[idx].password = firstTimeNewPass;
        users[idx].mustChangePassword = false;
      } else {
        users.push({
          fullName: pendingUser.fullName,
          email: pendingUser.email,
          role: pendingUser.role || "user",
          password: firstTimeNewPass,
          mustChangePassword: false,
        });
      }

      localStorage.setItem("taskflow_users", JSON.stringify(users));

      // Đóng modal & hoàn tất đăng nhập
      setShowFirstTimeModal(false);
      setSuccessMessage("✓ Đổi mật khẩu thành công! Đang chuyển hướng vào hệ thống...");
      
      setTimeout(() => {
        completeSuccessfulLogin({
          ...pendingUser,
          password: firstTimeNewPass,
          mustChangePassword: false,
        });
      }, 600);
    } catch {
      setFirstTimeError("Có lỗi xảy ra khi lưu mật khẩu. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <div className="my-[40px] md:my-[80px]">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[32px] sm:p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white shadow-sm">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[26px] sm:text-[28px] font-bold text-text text-center mt-[24px]">
              Chào mừng trở lại
            </h3>

            <p className="text-[14px] text-[#475569] text-center font-[400] mt-1">
              Đăng nhập bằng tài khoản công ty do Quản trị viên cấp.
            </p>

            {/* Thông báo thành công */}
            {successMessage && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium text-center animate-in fade-in">
                {successMessage}
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
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center animate-in fade-in">
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
                  Email công ty
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
                    placeholder="nguyenvana@taskflow.vn"
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
                    placeholder="Nhập mật khẩu hoặc mật khẩu tạm thời"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full outline-none text-sm text-slate-700 disabled:bg-transparent disabled:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-slate-600 transition cursor-pointer"
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
                    className="rounded accent-main h-4 w-4 cursor-pointer"
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
                {isLocked ? `Đang khóa (${countdown}s)` : "Đăng nhập hệ thống"}
              </button>

              {/* Thông báo chính sách cấp tài khoản nội bộ (Đã xóa dòng đăng ký) */}
              <div className="flex flex-col items-center justify-center text-center mt-2 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl gap-1">
                <div className="flex items-center gap-1.5 text-slate-600 text-[12.5px] font-semibold">
                  <LuShieldAlert className="text-amber-500 text-sm" />
                  <span>Chưa có tài khoản công ty?</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-snug">
                  Hệ thống không mở đăng ký tự do. Vui lòng liên hệ <strong>Quản trị viên (Admin)</strong> để được cấp Email & Mật khẩu tạm thời.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL BẮT BUỘC ĐỔI MẬT KHẨU LẦN ĐẦU (FIRST-TIME LOGIN PASSWORD CHANGE)     */}
      {/* ========================================================================= */}
      {showFirstTimeModal && pendingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[480px] rounded-[24px] bg-white p-[30px] sm:p-[36px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shadow-xs">
                  <LuKeyRound size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wide uppercase">
                      Lần đầu đăng nhập
                    </span>
                  </div>
                  <h3 className="text-[19px] font-bold text-slate-800 mt-1">
                    Đổi mật khẩu bảo mật
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFirstTimeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Thông tin tài khoản */}
            <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-main text-white font-bold text-xs flex items-center justify-center shrink-0">
                <LuUserCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{pendingUser.fullName}</p>
                <p className="text-[11.5px] text-slate-500 font-mono truncate">{pendingUser.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Tài khoản này đang sử dụng <strong>Mật khẩu tạm thời</strong> do Quản trị viên cấp. Vì lý do an toàn, bạn bắt buộc phải thiết lập mật khẩu cá nhân mới để kích hoạt tài khoản.
            </p>

            {/* Thông báo lỗi trong modal */}
            {firstTimeError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium animate-in fade-in">
                ⚠️ {firstTimeError}
              </div>
            )}

            {/* Form đổi mật khẩu */}
            <form onSubmit={handleConfirmFirstTimePassword} className="mt-4 flex flex-col gap-3.5">
              {/* Mật khẩu mới */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Mật khẩu mới (Tối thiểu 6 ký tự) *
                </label>
                <div className="relative">
                  <input
                    type={showFirstTimeNewPass ? "text" : "password"}
                    required
                    autoFocus
                    value={firstTimeNewPass}
                    onChange={(e) => {
                      setFirstTimeNewPass(e.target.value);
                      if (firstTimeError) setFirstTimeError(null);
                    }}
                    placeholder="Nhập mật khẩu mới của bạn..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFirstTimeNewPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showFirstTimeNewPass ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nhập lại mật khẩu mới */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Xác nhận lại mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showFirstTimeConfirmPass ? "text" : "password"}
                    required
                    value={firstTimeConfirmPass}
                    onChange={(e) => {
                      setFirstTimeConfirmPass(e.target.value);
                      if (firstTimeError) setFirstTimeError(null);
                    }}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFirstTimeConfirmPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showFirstTimeConfirmPass ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFirstTimeModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy đăng nhập
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-main px-5 py-2.5 text-xs font-semibold text-white hover:bg-main/90 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <LuCheck size={16} />
                  Xác nhận & Vào hệ thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
