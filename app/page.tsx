import Link from "next/link";
import { FaListCheck } from "react-icons/fa6";
import {
  LuLayoutDashboard,
  LuListChecks,
  LuFolderCheck,
  LuUsers,
  LuTable,
  LuLogOut,
} from "react-icons/lu";

export default function Page() {
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
