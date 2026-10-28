"use client";

import { API_BASE } from "@/app/config/api";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { usePathname, useRouter } from "next/navigation";

import {
  LuLayoutDashboard,
  LuListChecks,
  LuFolderCheck,
  LuUsers,
  LuTable,
  LuLogOut,
  LuShieldAlert,
  LuX,
} from "react-icons/lu";

import { deleteCookie } from "@/app/utils/cookie";
import { useSidebar } from "@/app/context/SidebarContext";

type SiderItem = {
  Icon: IconType;
  title: string;
  pathname: string;
};

// Menu dành riêng cho Admin (Quản trị viên)
export const siderItemsAdmin: SiderItem[] = [
  { Icon: LuLayoutDashboard, title: "Tổng quan Admin", pathname: "/admin/dashboard" },
  { Icon: LuListChecks, title: "Tất cả Task", pathname: "/admin/task/list" },
  { Icon: LuFolderCheck, title: "Bài nộp", pathname: "/admin/submit-task/list" },
  { Icon: LuUsers, title: "Thành viên", pathname: "/admin/member/list" },
];

// Menu dành riêng cho User (Thành viên)
export const siderItemsUser: SiderItem[] = [
  { Icon: LuLayoutDashboard, title: "Task của tôi", pathname: "/user/task/list" },
];

export const Sider = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const { isOpen, closeSidebar } = useSidebar();

  const [role, setRole] = useState<"user" | "admin">("user");
  const [currentUserRole, setCurrentUserRole] = useState<string>("user");

  // Tự động đóng sider trên mobile khi chuyển route
  useEffect(() => {
    closeSidebar();
  }, [currentPath]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("taskflow_current_user");
      console.log(">> [Sider] Dữ liệu trong localStorage:", savedUserStr);

      if (!savedUserStr) {
        console.warn(">> [Sider] Chưa có taskflow_current_user trong localStorage!");
        return;
      }

      try {
        const u = JSON.parse(savedUserStr);

        // 1. NẠP NGAY ROLE TỪ LOCALSTORAGE ĐỂ RENDER TỨC THÌ (Không bị chậm)
        if (u.role === "admin") {
          setRole("admin");
          setCurrentUserRole("admin");
        } else {
          setRole("user");
          setCurrentUserRole("user");
        }

        if (!u.email) return;

        // 2. GỌI API BACKEND ĐỂ ĐỒNG BỘ VÀ XÁC THỰC LẠI
        fetch(`${API_BASE}/api/users/account/${encodeURIComponent(u.email)}`, {
          credentials: "include",
        })
          .then((res) => {
            if (!res.ok) throw new Error("API trả về lỗi HTTP: " + res.status);
            return res.json();
          })
          .then((data) => {
            console.log(">> [Sider] Dữ liệu từ API Backend:", data);
            if (data.code === "success" && data.data?.role) {
              const actualRole = data.data.role.toLowerCase() === "admin" ? "admin" : "user";
              setRole(actualRole);
              setCurrentUserRole(actualRole);
            }
          })
          .catch((err) => {
            console.error(">> [Sider] Lỗi khi gọi API kiểm tra role:", err);
          });
      } catch (e) {
        console.error(">> [Sider] Lỗi parse JSON user:", e);
      }
    }
  }, []);

  const sider = currentUserRole === "admin" ? siderItemsAdmin : siderItemsUser;

  // Đăng xuất
  const handleLogout = () => {
    deleteCookie("taskflow_token");
    deleteCookie("taskflow_role");
    deleteCookie("taskflow_user");
    localStorage.removeItem("taskflow_current_user");
    router.push("/account/login");
  };

  return (
    <>
      {/* Lớp nền mờ overlay trên mobile khi mở Sider */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sider bar */}
      <aside
        className={`fixed left-[0px] top-[0px] z-[70] h-screen w-[260px] flex-col overflow-y-auto border-r-[1px] border-[#E2E8F0] bg-[#FFFFFF] transition-transform duration-300 ease-in-out lg:z-[50] lg:flex lg:w-[254px] lg:translate-x-0 ${
          isOpen ? "flex translate-x-0 shadow-2xl" : "hidden -translate-x-full lg:flex"
        }`}
      >
        {/* Logo & Nút đóng trên mobile */}
        <div className="flex items-center justify-between p-[20px] lg:p-[24px]">
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[#4F46E5] text-[18px] text-[#FFFFFF]">
              <FaListCheck />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#182230]">TaskFlow</span>
              <span className="text-[11px] font-semibold text-slate-400">
                {role === "admin" ? "Không gian Admin" : "Không gian Thành viên"}
              </span>
            </div>
          </div>

          {/* Nút đóng sidebar trên mobile */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Đóng menu điều hướng"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition lg:hidden cursor-pointer"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-[16px]">
          <p className="mb-[8px] px-[16px] text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
            {role === "admin" ? "Quản trị hệ thống" : "Không gian làm việc"}
          </p>

          <ul className="space-y-[4px]">
            {sider.map(({ Icon, title, pathname }) => {
              const isActive = currentPath.startsWith(pathname);

              return (
                <li key={pathname}>
                  <Link
                    href={pathname}
                    onClick={closeSidebar}
                    className={`flex items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] transition ${
                      isActive
                        ? "bg-[#EEF2FF] font-semibold text-[#4F46E5]"
                        : "text-[#475467] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <Icon className="text-[18px]" />
                    <span>{title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Đăng xuất */}
        <div className="border-t-[1px] border-[#E2E8F0] p-[16px]">
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              handleLogout();
            }}
            className="flex w-full items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#EF4444] transition hover:bg-[#FEF2F2] cursor-pointer"
          >
            <LuLogOut className="text-[18px]" />
            Đăng xuất
          </button>
        </div>
      </aside>
      {/* End Sider bar */}
    </>
  );
};
