"use client";

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
} from "react-icons/lu";

type SiderItem = {
  Icon: IconType;
  title: string;
  pathname: string;
};

// Menu dành riêng cho Admin (Quản trị viên)
export const siderItemsAdmin: SiderItem[] = [
  { Icon: LuLayoutDashboard, title: "Tổng quan Admin", pathname: "/admin/dashboard" },
  { Icon: LuListChecks, title: "Tất cả Task", pathname: "/admin/tasks/list" },
  { Icon: LuFolderCheck, title: "Bài nộp nhóm", pathname: "/admin/submit-task/list" },
  { Icon: LuUsers, title: "Thành viên", pathname: "/admin/member/list" },
  { Icon: LuTable, title: "Xuất Excel", pathname: "/admin/export/exel" },
];

// Menu dành riêng cho User (Thành viên) - Hoàn toàn không dính menu Admin
export const siderItemsUser: SiderItem[] = [
  { Icon: LuLayoutDashboard, title: "Task của tôi", pathname: "/user/task/list" },
  { Icon: LuFolderCheck, title: "Bài đã nộp", pathname: "/user/task/submitted" },
];

export const Sider = () => {
  const currentPath = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<"user" | "admin">("user");
  const [currentUserRole, setCurrentUserRole] = useState<string>("user");

  // Tự động nhận diện phân quyền dựa theo URL và thông tin đăng nhập
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("taskflow_current_user");
      let userRole: "user" | "admin" = "user";
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u.role === "admin") userRole = "admin";
        } catch {}
      }
      setCurrentUserRole(userRole);

      // Nếu đang ở các đường dẫn /admin/... thì kích hoạt menu admin
      if (currentPath.startsWith("/admin")) {
        setRole("admin");
      } else {
        setRole("user");
      }
    }
  }, [currentPath]);

  const sider = role === "admin" ? siderItemsAdmin : siderItemsUser;

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("taskflow_current_user");
    router.push("/account/login");
  };

  return (
    <>
      {/* Sider bar */}
      <aside className="fixed left-[0px] top-[0px] z-[50] hidden h-screen w-[254px] flex-col overflow-y-auto border-r-[1px] border-[#E2E8F0] bg-[#FFFFFF] lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-[12px] p-[24px]">
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

        {/* Cho phép tài khoản Quản trị viên (Admin) chuyển đổi linh hoạt chế độ xem */}
        {currentUserRole === "admin" && (
          <div className="px-4 py-2 border-t border-slate-100">
            {role === "admin" ? (
              <Link
                href="/user/task/list"
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-main transition"
              >
                <span className="flex items-center gap-1.5">
                  <LuShieldAlert size={14} />
                  Xem với vai trò User
                </span>
                <span>⇄</span>
              </Link>
            ) : (
              <Link
                href="/admin/member/list"
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-main hover:bg-indigo-100 transition"
              >
                <span className="flex items-center gap-1.5">
                  <LuShieldAlert size={14} />
                  Quay lại Admin
                </span>
                <span>👑</span>
              </Link>
            )}
          </div>
        )}

        {/* Đăng xuất */}
        <div className="border-t-[1px] border-[#E2E8F0] p-[16px]">
          <button
            type="button"
            onClick={handleLogout}
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
