"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuBell,
  LuChevronRight,
  LuLogOut,
  LuMenu,
  LuSearch,
  LuShieldCheck,
  LuUser,
} from "react-icons/lu";
import { deleteCookie } from "@/app/utils/cookie";
import { authService } from "@/app/services/authService";
import { useSidebar } from "@/app/context/SidebarContext";

interface CurrentUser {
  userId?: number;
  fullName?: string;
  email?: string;
  role?: string;
  avatar?: string | null;
}

export const Header = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<CurrentUser>({
    fullName: "Thành viên",
    email: "",
    role: "user",
  });

  // Đóng dropdown tài khoản khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("taskflow_current_user");
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);

          // Tự động đồng bộ thông tin mới nhất từ CSDL để sửa lỗi font cũ trong localStorage
          if (parsed.email) {
            authService.getAccount(parsed.email).then((res: any) => {
              if (res.code === "success" && res.data) {
                const updated: CurrentUser = {
                  userId: res.data.id || parsed.userId,
                  fullName: res.data.fullName || parsed.fullName,
                  email: res.data.email || parsed.email,
                  role: res.data.role || parsed.role,
                  avatar: res.data.avatar || parsed.avatar,
                };
                setUser(updated);
                localStorage.setItem("taskflow_current_user", JSON.stringify(updated));
              }
            }).catch(() => {});
          }
        } catch (e) {
          console.error("Lỗi parse thông tin user:", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    deleteCookie("taskflow_token");
    deleteCookie("taskflow_role");
    deleteCookie("taskflow_user");
    localStorage.removeItem("taskflow_current_user");
    router.push("/account/login");
  };

  const initialLetter = user.fullName ? user.fullName.trim().slice(-1).toUpperCase() : "U";
  const profileLink = user.role === "admin" ? "/admin/profile" : "/user/profile";

  return (
    <>
      {/* Header */}
      <header className="fixed right-[0px] top-[0px] z-[30] flex h-[80px] w-full items-center justify-between border-b-[1px] border-[#E2E8F0] bg-[#FFFFFF] px-[16px] md:px-[24px] lg:w-[calc(100%-254px)] xl:px-[32px]">
        {/* Trái: hamburger (mobile) + breadcrumb */}
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Mở menu điều hướng"
            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[12px] text-[22px] text-[#182230] transition hover:bg-slate-100 lg:hidden"
          >
            <LuMenu />
          </button>

          <div className="flex items-center gap-[12px] text-[14px]">
            <span className="hidden text-[#64748B] sm:block">Không gian làm việc</span>
            <LuChevronRight className="hidden text-[16px] text-[#64748B] sm:block" />
            <span className="font-semibold text-[#182230]">
              {user.role === "admin" ? "Quản trị viên" : "Tổng quan"}
            </span>
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
            className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[50%] text-[20px] text-[#475569] transition hover:bg-[#F5F6FA] cursor-pointer"
          >
            <LuBell />
            <span className="absolute right-[10px] top-[9px] h-[8px] w-[8px] rounded-[50%] bg-[#4F46E5] ring-[2px] ring-[#FFFFFF]" />
          </button>

          {/* Đường kẻ dọc */}
          <div className="hidden h-[28px] w-[1px] bg-[#E2E8F0] sm:block" />

          {/* Vùng Avatar + Popup tài khoản (click để bật/tắt) */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="relative flex h-[42px] w-[42px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-[15px] font-bold text-white shadow-sm ring-2 ring-indigo-200 transition hover:ring-main focus:outline-none"
              title={user.fullName || "Tài khoản"}
              aria-expanded={isProfileOpen}
            >
              <span>{initialLetter}</span>
              <span className="absolute bottom-[0px] right-[0px] h-[10px] w-[10px] rounded-full bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
            </button>

            {/* Popup thông tin tài khoản hiển thị khi click */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full z-50 pt-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="w-[300px] sm:w-[330px] max-w-[calc(100vw-32px)] rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0px_20px_60px_0px_#10182833]">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                      Tài khoản cá nhân
                    </span>
                  </div>

                  {/* Avatar + Tên + Email */}
                  <div className="mt-3 flex flex-col items-center text-center">
                    <div className="relative flex h-[66px] w-[66px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-[24px] font-bold text-white shadow-md ring-4 ring-indigo-100">
                      <span>{initialLetter}</span>
                    </div>

                    <h4 className="mt-3 line-clamp-1 text-[16px] font-bold text-slate-800">
                      {user.fullName || "Người dùng"}
                    </h4>
                    <p className="mt-0.5 break-all px-2 text-[12.5px] text-slate-500">
                      {user.email || "email@taskflow.vn"}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-0.5 text-[11px] font-semibold text-main">
                      <LuShieldCheck size={13} />
                      {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                    </span>
                  </div>

                  {/* Danh sách hành động */}
                  <div className="mt-4 flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <Link
                      href={profileLink}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-main"
                    >
                      <LuUser className="text-[16px] text-slate-500" />
                      <span>Xem thông tin cá nhân</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LuLogOut className="text-[16px] text-red-500" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
