"use client";
import Link from "next/link";
import { FaListCheck } from "react-icons/fa6";
import type { IconType } from "react-icons";

import {
  LuLayoutDashboard,
  LuListChecks,
  LuFolderCheck,
  LuUsers,
  LuTable,
  LuLogOut,
} from "react-icons/lu";
import { usePathname } from "next/navigation";

type SiderItem = {
  Icon: IconType;
  title: string;
  pathname: string;
};

export const siderItemsAdmin: SiderItem[] = [
  { Icon: LuLayoutDashboard, title: "Tổng quan", pathname: "/admin/dashboard" },

  { Icon: LuListChecks, title: "Task", pathname: "/admin/tasks/list" },

  { Icon: LuFolderCheck, title: "Bài nộp", pathname: "/admin/submit-task/list" },

  { Icon: LuUsers, title: "Thành viên", pathname: "/admin/member/list" },

  { Icon: LuTable, title: "Xuất Excel", pathname: "/admin/export/exel" },
];

export const siderItemsUser: SiderItem[] = [
  { Icon: LuLayoutDashboard, title: "Task của tôi", pathname: "/user/task/list" },

  { Icon: LuFolderCheck, title: "Đã nộp", pathname: "/user/submit-task/list" },
];

export const Sider = () => {
  const currentPath = usePathname();
  let role = "user";
  const sider = role == "admin" ? siderItemsAdmin : siderItemsUser;

  return (
    <>
      {/* Sider bar */}
      <aside className="fixed left-[0px] top-[0px] z-[50] hidden h-screen w-[254px] flex-col overflow-y-auto border-r-[1px] border-[#E2E8F0] bg-[#FFFFFF] lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-[12px] p-[24px]">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[#4F46E5] text-[18px] text-[#FFFFFF]">
            <FaListCheck />
          </div>
          <span className="text-[20px] font-bold text-[#182230]">TaskFlow</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-[16px]">
          <p className="mb-[8px] px-[16px] text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
            Không gian làm việc
          </p>

          <ul className="space-y-[4px]">
            {sider.map(({ Icon, title, pathname }) => {
              const isActive = currentPath.startsWith(pathname);

              return (
                <li key={pathname}>
                  <Link
                    href={pathname}
                    className={`flex items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] ${
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
            className="flex w-full items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#EF4444] transition hover:bg-[#FEF2F2]"
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
