"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuBell,
  LuChevronRight,
  LuLogOut,
  LuMenu,
  LuSearch,
  LuUserPlus,
  LuX,
  LuShieldCheck,
  LuUser,
  LuLock,
  LuArrowRightLeft,
} from "react-icons/lu";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface UserProfile {
  fullName: string;
  email: string;
  role?: string;
  avatar?: string;
  dob?: string;
  phone?: string;
  address?: string;
  lastAvatarChangedDate?: string;
  lastNameChangedDate?: string;
}

interface SubAccount {
  fullName: string;
  email: string;
  avatar?: string;
  role?: string;
}

export const Header = ({ onMenuToggle }: { onMenuToggle?: () => void }) => {
  const router = useRouter();

  // Thông tin người dùng đăng nhập hiện tại
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    fullName: "Nguyễn Võ Anh Kiệt",
    email: "kiet.nguyen@taskflow.vn",
    role: "user",
  });

  // Danh sách tài khoản phụ liên kết
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);

  // State mở popup thông tin tài khoản ở góc phải
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Modal xác nhận mật khẩu để chuyển sang tài khoản phụ
  const [switchingSubAccount, setSwitchingSubAccount] = useState<SubAccount | null>(null);
  const [subPasswordInput, setSubPasswordInput] = useState("");
  const [showSubPassword, setShowSubPassword] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Đọc thông tin từ localStorage khi tải trang
  const loadUserData = () => {
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("taskflow_current_user");
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u.fullName && u.email) {
            setCurrentUser(u);
            loadSubAccounts(u.email);
          }
        } catch {}
      }
    }
  };

  const loadSubAccounts = (parentEmail: string) => {
    try {
      const allSubsStr = localStorage.getItem("taskflow_sub_accounts");
      let list: SubAccount[] = [];
      if (allSubsStr) {
        const allSubs = JSON.parse(allSubsStr);
        list = allSubs[parentEmail.toLowerCase()] || [];
      }

      // Nếu chưa có tài khoản phụ, tạo sẵn 1 nick phụ mẫu demo cho tài khoản Kiệt
      if (list.length === 0 && parentEmail.toLowerCase().includes("kiet")) {
        list = [
          {
            fullName: "Nguyên Kiệt (Phụ)",
            email: "kiet.sub@taskflow.vn",
            role: "user",
          },
        ];
        // Lưu mẫu vào taskflow_sub_accounts
        const allSubs = allSubsStr ? JSON.parse(allSubsStr) : {};
        allSubs[parentEmail.toLowerCase()] = list;
        localStorage.setItem("taskflow_sub_accounts", JSON.stringify(allSubs));

        // Đảm bảo tài khoản phụ mẫu có trong taskflow_users
        const usersStr = localStorage.getItem("taskflow_users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        if (!users.some((u: { email: string }) => u.email.toLowerCase() === "kiet.sub@taskflow.vn")) {
          users.push({
            fullName: "Nguyên Kiệt (Phụ)",
            email: "kiet.sub@taskflow.vn",
            password: "Pass@123",
            role: "user",
          });
          localStorage.setItem("taskflow_users", JSON.stringify(users));
        }
      }

      setSubAccounts(list);
    } catch {}
  };

  useEffect(() => {
    loadUserData();

    // Lắng nghe sự kiện cập nhật profile từ trang Profile
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail && customEvent.detail.fullName) {
        setCurrentUser({ ...customEvent.detail });
      }
      loadUserData();
    };
    window.addEventListener("taskflow_profile_updated", handleProfileUpdate);
    return () => window.removeEventListener("taskflow_profile_updated", handleProfileUpdate);
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tính chữ cái viết tắt avatar: Lấy chữ cái đầu của TÊN GỌI (từ cuối cùng)
  // Ví dụ: "Nguyên Kiệt" -> "Kiệt" -> chữ "K"
  //        "Nguyễn Võ Anh Kiệt" -> "Kiệt" -> chữ "K"
  //        "Lê Trần Hoàng Nam" -> "Nam" -> chữ "N"
  const getInitials = (name: string) => {
    if (!name) return "K";
    const parts = name.trim().split(/\s+/);
    const lastName = parts[parts.length - 1];
    return lastName ? lastName.charAt(0).toUpperCase() : "K";
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("taskflow_current_user");
    router.push("/account/login");
  };


  // Khi bấm vào 1 tài khoản phụ -> Hiện popup hỏi mật khẩu
  const handleSelectSubAccount = (sub: SubAccount) => {
    setSwitchingSubAccount(sub);
    setSubPasswordInput("");
    setSwitchError(null);
    setShowAccountMenu(false);
  };

  // Xác nhận mật khẩu để chuyển sang tài khoản phụ
  const handleConfirmSwitchSubAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchingSubAccount) return;

    if (!subPasswordInput) {
      setSwitchError("Vui lòng nhập mật khẩu tài khoản phụ!");
      return;
    }

    // Kiểm tra mật khẩu trong taskflow_users và defaultAccounts
    let isValidPassword = false;
    let targetUserData: any = null;

    try {
      const usersStr = localStorage.getItem("taskflow_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const found = users.find(
        (u: { email: string }) => u.email.toLowerCase() === switchingSubAccount.email.toLowerCase()
      );
      if (found) {
        targetUserData = found;
        if (found.password === subPasswordInput) {
          isValidPassword = true;
        }
      }
    } catch {}

    // Fallback mật khẩu mặc định "Pass@123" cho tài khoản mẫu
    if (!isValidPassword && subPasswordInput === "Pass@123") {
      isValidPassword = true;
    }

    if (!isValidPassword) {
      setSwitchError("Mật khẩu không chính xác! (Mật khẩu mặc định: Pass@123)");
      return;
    }

    // Lưu tài khoản hiện tại vào danh sách tài khoản phụ của tài khoản mới (để có thể đổi ngược lại)
    try {
      const allSubsStr = localStorage.getItem("taskflow_sub_accounts");
      const allSubs = allSubsStr ? JSON.parse(allSubsStr) : {};
      const newEmail = switchingSubAccount.email.toLowerCase();
      if (!allSubs[newEmail]) allSubs[newEmail] = [];
      if (!allSubs[newEmail].some((x: SubAccount) => x.email.toLowerCase() === currentUser.email.toLowerCase())) {
        allSubs[newEmail].push({
          fullName: currentUser.fullName,
          email: currentUser.email,
          avatar: currentUser.avatar,
          role: currentUser.role,
        });
        localStorage.setItem("taskflow_sub_accounts", JSON.stringify(allSubs));
      }
    } catch {}

    // Chuyển đổi tài khoản đăng nhập hiện tại
    const newActiveUser: UserProfile = {
      fullName: targetUserData?.fullName || switchingSubAccount.fullName,
      email: targetUserData?.email || switchingSubAccount.email,
      role: targetUserData?.role || switchingSubAccount.role || "user",
      avatar: targetUserData?.avatar || switchingSubAccount.avatar,
      dob: targetUserData?.dob,
      phone: targetUserData?.phone,
      address: targetUserData?.address,
      lastAvatarChangedDate: targetUserData?.lastAvatarChangedDate,
      lastNameChangedDate: targetUserData?.lastNameChangedDate,
    };

    localStorage.setItem("taskflow_current_user", JSON.stringify(newActiveUser));
    setCurrentUser(newActiveUser);
    setSwitchingSubAccount(null);

    // Chuyển hướng theo role của tài khoản mới
    if (newActiveUser.role === "admin") {
      router.push("/admin/member/list");
    } else {
      router.push("/user/task/list");
    }

    window.location.reload();
  };

  return (
    <>
      {/* Header */}
      <header className="fixed right-[0px] top-[0px] z-[30] flex h-[80px] w-full items-center justify-between border-b-[1px] border-[#E2E8F0] bg-[#FFFFFF] px-[16px] md:px-[24px] lg:w-[calc(100%-254px)] xl:px-[32px]">
        {/* Trái: hamburger (mobile) + breadcrumb */}
        <div className="flex items-center gap-[12px]">
          <label
            htmlFor="menu-toggle"
            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[12px] text-[22px] text-[#182230] lg:hidden"
          >
            <LuMenu />
          </label>

          <div className="flex items-center gap-[12px] text-[14px]">
            <span className="hidden text-[#64748B] sm:block">Không gian làm việc</span>
            <LuChevronRight className="hidden text-[16px] text-[#64748B] sm:block" />
            <span className="font-semibold text-[#182230]">Tổng quan</span>
          </div>
        </div>

        {/* Phải: tìm kiếm + chuông + avatar */}
        <div className="flex items-center gap-[16px]">
          <div className="relative hidden md:block">
            <LuSearch className="absolute left-[14px] top-[50%] -translate-y-[50%] text-[16px] text-[#64748B]" />
            <input
              type="text"
              placeholder="Tìm kiếm trong nhóm..."
              className="h-[40px] w-[260px] rounded-[12px] bg-[#F5F6FA] pl-[40px] pr-[14px] text-[14px] text-[#182230] outline-none placeholder:text-[#94A3B8] focus:ring-[2px] focus:ring-[#4F46E533] xl:w-[300px]"
            />
          </div>

          {/* Chuông thông báo */}
          <button
            type="button"
            className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[50%] text-[20px] text-[#475569] transition hover:bg-[#F5F6FA]"
          >
            <LuBell />
            <span className="absolute right-[10px] top-[9px] h-[8px] w-[8px] rounded-[50%] bg-[#4F46E5] ring-[2px] ring-[#FFFFFF]" />
          </button>

          {/* Đường kẻ dọc */}
          <div className="hidden h-[28px] w-[1px] bg-[#E2E8F0] sm:block" />

          {/* Vùng Avatar + Popup tài khoản (Góc phải) */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setShowAccountMenu((prev) => !prev)}
              onMouseEnter={() => setShowAccountMenu(true)}
              className="relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-[15px] font-bold text-white shadow-sm ring-2 ring-indigo-200 hover:ring-main transition overflow-hidden"
              title={currentUser.fullName}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{getInitials(currentUser.fullName)}</span>
              )}
              <span className="absolute bottom-[0px] right-[0px] h-[10px] w-[10px] rounded-full bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
            </div>

            {/* Popup Thông tin tài khoản */}
            {showAccountMenu && (
              <div className="absolute right-0 top-[120%] z-50 w-[330px] rounded-[24px] bg-white p-5 shadow-[0px_20px_60px_0px_#10182833] border border-[#E2E8F0] animate-in fade-in duration-150">
                {/* Nút đóng */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tài khoản cá nhân
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAccountMenu(false)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                  >
                    <LuX size={18} />
                  </button>
                </div>

                {/* Thông tin avatar + Tên + Gmail */}
                <div className="flex flex-col items-center text-center mt-3">
                  <div className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-[24px] font-bold text-white shadow-md ring-4 ring-pink-100 overflow-hidden">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(currentUser.fullName)}</span>
                    )}
                  </div>

                  <h4 className="mt-3 text-[16px] font-bold text-slate-800 line-clamp-1">
                    {currentUser.fullName}
                  </h4>
                  <p className="text-[12.5px] text-slate-500 break-all px-2 mt-0.5">
                    {currentUser.email}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-0.5 text-[11px] font-semibold text-main">
                    <LuShieldCheck size={13} />
                    {currentUser.role === "admin" ? "Quản trị viên (Admin)" : "Thành viên chính thức"}
                  </span>
                </div>

                {/* Danh sách tài khoản phụ (Google-style Account Switcher) */}
                {subAccounts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1 mb-2">
                      Tài khoản phụ đã liên kết ({subAccounts.length})
                    </span>
                    <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
                      {subAccounts.map((sub) => (
                        <button
                          key={sub.email}
                          type="button"
                          onClick={() => handleSelectSubAccount(sub)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/70 transition text-left group cursor-pointer border border-transparent hover:border-indigo-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs grid place-items-center shrink-0 overflow-hidden">
                              {sub.avatar ? (
                                <img
                                  src={sub.avatar}
                                  alt={sub.fullName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span>{getInitials(sub.fullName)}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12.5px] font-semibold text-slate-800 truncate group-hover:text-main">
                                {sub.fullName}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">{sub.email}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium text-main shrink-0 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <LuArrowRightLeft size={13} />
                            Đổi
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danh sách hành động */}
                <div className="mt-4 border-t border-slate-100 pt-3 flex flex-col gap-1">

                  {/* Xem thông tin cá nhân (Form thực quyền người dùng) */}
                  <Link
                    href="/user/profile"
                    onClick={() => setShowAccountMenu(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-main transition text-left cursor-pointer"
                  >
                    <LuUser className="text-slate-500 text-[16px]" />
                    <span>Xem thông tin cá nhân</span>
                  </Link>

                  {/* Đăng xuất */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 transition text-left cursor-pointer mt-1"
                  >
                    <LuLogOut className="text-red-500 text-[16px]" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Nhập mật khẩu để chuyển sang tài khoản phụ */}
      {switchingSubAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-[420px] rounded-[22px] bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-main">
                  <LuArrowRightLeft size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Chuyển tài khoản</h3>
                  <p className="text-[12px] text-slate-400">Đăng nhập vào tài khoản phụ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSwitchingSubAccount(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Thông tin tài khoản đích */}
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-main text-white font-bold text-sm grid place-items-center shrink-0">
                {getInitials(switchingSubAccount.fullName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {switchingSubAccount.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">{switchingSubAccount.email}</p>
              </div>
            </div>

            {switchError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                ⚠️ {switchError}
              </div>
            )}

            <form onSubmit={handleConfirmSwitchSubAccount} className="mt-4 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Mật khẩu tài khoản phụ *
                </label>
                <div className="relative">
                  <input
                    type={showSubPassword ? "text" : "password"}
                    required
                    autoFocus
                    value={subPasswordInput}
                    onChange={(e) => {
                      setSubPasswordInput(e.target.value);
                      if (switchError) setSwitchError(null);
                    }}
                    placeholder="Nhập mật khẩu..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSubPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSubPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mẹo: Nhập mật khẩu đã tạo khi đăng ký (Tài khoản mẫu: <code className="font-semibold text-slate-600">Pass@123</code>).
                </p>
              </div>

              <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setSwitchingSubAccount(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white hover:bg-main/90 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <LuLock size={14} />
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
