import Link from "next/link";
import { FaListCheck } from "react-icons/fa6";
import {
  LuLayoutDashboard,
  LuListChecks,
  LuFolderCheck,
  LuUsers,
  LuTable,
  LuLogOut,
  LuBell,
  LuChevronRight,
  LuMenu,
  LuSearch,
} from "react-icons/lu";

import {} from "react-icons/lu";

export default function Page() {
  return (
    <>
      {/* Header */}
      <header className="fixed right-[0px] top-[0px] z-[30] flex h-[72px] w-full items-center justify-between border-b-[1px] border-[#E2E8F0] bg-[#FFFFFF] px-[16px] md:px-[24px] lg:w-[calc(100%-254px)] xl:px-[32px]">
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

          {/* Avatar + chấm online */}
          <div className="relative flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[50%] bg-[#E0E7FF] text-[13px] font-bold text-[#4F46E5]">
            HN
            <span className="absolute bottom-[0px] right-[0px] h-[10px] w-[10px] rounded-[50%] bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
          </div>
        </div>
      </header>
      {/* EndHeader */}

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
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-[12px] rounded-[12px] bg-[#EEF2FF] px-[16px] py-[12px] text-[14px] font-semibold text-[#4F46E5]"
              >
                <LuLayoutDashboard className="text-[18px]" />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/tasks"
                className="flex items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#475569] transition hover:bg-[#F9FAFB] hover:text-[#4F46E5]"
              >
                <LuListChecks className="text-[18px]" />
                <span>Task</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/submissions"
                className="flex items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#475569] transition hover:bg-[#F9FAFB] hover:text-[#4F46E5]"
              >
                <LuFolderCheck className="text-[18px]" />
                <span>Bài nộp</span>
                <span className="rounded-[6px] bg-[#EEF2FF] px-[6px] py-[2px] text-[12px] font-semibold text-[#4F46E5]">
                  2
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/members"
                className="flex items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#475569] transition hover:bg-[#F9FAFB] hover:text-[#4F46E5]"
              >
                <LuUsers className="text-[18px]" />
                <span>Thành viên</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/export"
                className="flex items-center gap-[12px] rounded-[12px] px-[16px] py-[12px] text-[14px] font-medium text-[#475569] transition hover:bg-[#F9FAFB] hover:text-[#4F46E5]"
              >
                <LuTable className="text-[18px]" />
                <span>Xuất Excel</span>
              </Link>
            </li>
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
}
