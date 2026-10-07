import { LuBell, LuChevronRight, LuMenu, LuSearch } from "react-icons/lu";

export const Header = () => {
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
    </>
  );
};
