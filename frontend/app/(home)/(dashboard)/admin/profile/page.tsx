import {
  LuCamera,
  LuCheck,
  LuChevronRight,
  LuLock,
  LuMail,
  LuMapPin,
  LuPhone,
  LuUser,
  LuCalendar,
} from "react-icons/lu";

export default function Page() {
  return (
    <div className="w-full  pb-12">
      {/* ── Card thông tin chính ─────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
        {/* Phần Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-7 border-b border-[#F1F5F9]">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-slate-50">
              K
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-main text-white shadow-md hover:bg-main/90 transition cursor-pointer"
              title="Đổi ảnh đại diện"
            >
              <LuCamera size={14} />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-base font-bold text-text">Nguyễn Võ Anh Kiệt</h3>
            <p className="text-xs text-slate-500">kiet.nguyen@taskflow.vn</p>
            <label className="inline-block mt-2 text-xs font-semibold text-main hover:underline cursor-pointer">
              <span>Tải ảnh mới lên (JPG, PNG, tối đa 3MB)</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Form điền thông tin */}
        <form className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Họ và tên</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="Nguyễn Võ Anh Kiệt"
                  placeholder="Nhập họ và tên..."
                  className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main"
                />
                <LuUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>

            {/* Email định danh */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Email định danh</label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <LuLock size={12} /> Cố định
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  readOnly
                  defaultValue="kiet.nguyen@taskflow.vn"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 py-2.5 pl-9 pr-8 text-sm text-slate-500 cursor-not-allowed select-none"
                />
                <LuMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
              <div className="relative">
                <input
                  type="tel"
                  defaultValue="0912345678"
                  placeholder="Nhập số điện thoại..."
                  className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main"
                />
                <LuPhone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Ngày sinh</label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue="2005-04-27"
                  className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main cursor-pointer"
                />
                <LuCalendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>

            {/* Địa chỉ thường trú */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Địa chỉ</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="131 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                  className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main"
                />
                <LuMapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Footer nút bấm */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F1F5F9]">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-main text-xs font-semibold text-white hover:bg-main/90 transition shadow-sm cursor-pointer"
            >
              <LuCheck size={14} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
