"use client";

import { useEffect, useRef, useState } from "react";
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
} from "react-icons/lu";

export const Header = () => {
  const router = useRouter();

  // Thông tin người dùng đăng nhập hiện tại
  const [currentUser, setCurrentUser] = useState<{
    fullName: string;
    email: string;
    role?: string;
  }>({
    fullName: "Nguyễn Võ Anh Kiệt",
    email: "tranvanthanh301995@gmail.com",
    role: "user",
  });

  // State mở popup thông tin tài khoản ở góc phải
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showAddSubAccountModal, setShowAddSubAccountModal] = useState(false);
  const [subAccountEmail, setSubAccountEmail] = useState("");
  const [subAccountName, setSubAccountName] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  // Đọc thông tin từ localStorage khi tải trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("taskflow_current_user");
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u.fullName && u.email) {
            setCurrentUser(u);
          }
        } catch {}
      }
    }
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

  // Tính chữ cái viết tắt avatar (ví dụ "Nguyễn Võ Anh Kiệt" -> "AK")
  const getInitials = (name: string) => {
    if (!name) return "AK";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("taskflow_current_user");
    router.push("/account/login");
  };

  // Thêm tài khoản phụ
  const handleAddSubAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAccountEmail || !subAccountName) return;

    // Lưu và chuyển sang tài khoản mới
    const newSubUser = {
      fullName: subAccountName.trim(),
      email: subAccountEmail.trim(),
      role: "user",
    };
    localStorage.setItem("taskflow_current_user", JSON.stringify(newSubUser));
    setCurrentUser(newSubUser);
    setShowAddSubAccountModal(false);
    setShowAccountMenu(false);
    setSubAccountEmail("");
    setSubAccountName("");
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
              className="relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-[14px] font-bold text-white shadow-sm ring-2 ring-indigo-200 hover:ring-main transition"
            >
              {getInitials(currentUser.fullName)}
              <span className="absolute bottom-[0px] right-[0px] h-[10px] w-[10px] rounded-full bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
            </div>

            {/* Popup Thông tin tài khoản (Y hệt giao diện tài khoản Google ảnh 2 của bạn) */}
            {showAccountMenu && (
              <div className="absolute right-0 top-[120%] z-50 w-[320px] rounded-[24px] bg-white p-5 shadow-[0px_20px_60px_0px_#10182833] border border-[#E2E8F0] animate-in fade-in duration-150">
                {/* Nút đóng */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAccountMenu(false)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  >
                    <LuX size={18} />
                  </button>
                </div>

                {/* Thông tin avatar + Tên + Gmail */}
                <div className="flex flex-col items-center text-center mt-1">
                  <div className="relative flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-[20px] font-bold text-white shadow-md ring-4 ring-pink-100">
                    {getInitials(currentUser.fullName)}
                  </div>

                  <h4 className="mt-3 text-[16px] font-bold text-text line-clamp-1">
                    {currentUser.fullName}
                  </h4>
                  <p className="text-[12.5px] text-slate-500 break-all px-2 mt-0.5">
                    {currentUser.email}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-0.5 text-[11px] font-semibold text-main">
                    <LuShieldCheck size={13} />
                    {currentUser.role === "admin" ? "Quản trị viên" : "Thành viên chính thức"}
                  </span>
                </div>

                {/* Danh sách hành động */}
                <div className="mt-5 border-t border-slate-100 pt-3 flex flex-col gap-1.5">
                  {/* Thêm tài khoản phụ */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(false);
                      setShowAddSubAccountModal(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition text-left"
                  >
                    <LuUserPlus className="text-slate-500 text-[16px]" />
                    <span>Thêm tài khoản phụ</span>
                  </button>

                  {/* Đăng xuất */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 transition text-left"
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

      {/* Modal Thêm tài khoản phụ */}
      {showAddSubAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-text">Thêm tài khoản phụ</h3>
              <button
                type="button"
                onClick={() => setShowAddSubAccountModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <LuX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubAccount} className="mt-4 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={subAccountName}
                  onChange={(e) => setSubAccountName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn B"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-main"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Địa chỉ Gmail</label>
                <input
                  type="email"
                  required
                  value={subAccountEmail}
                  onChange={(e) => setSubAccountEmail(e.target.value)}
                  placeholder="nguyenvanb@gmail.com"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-main"
                />
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubAccountModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  Chuyển tài khoản này
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
