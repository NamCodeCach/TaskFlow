"use client";

import {
  LuChevronDown,
  LuPencil,
  LuSearch,
  LuShieldCheck,
  LuTrash2,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";

// =============================================================================
// DỮ LIỆU THÀNH VIÊN FIX CỨNG TĨNH (STATIC DATA)
// Sau này bạn chỉ cần thay mảng này bằng API bạn tự viết.
// =============================================================================
const MEMBERS = [
  {
    id: 1,
    name: "Lê Trần Hoàng Nam",
    initials: "HN",
    email: "nam.nguyen@taskflow.vn",
    phone: "0901 234 567",
    role: "ADMIN",
    tasks: 0,
    joined: "01/10/2026",
    avatarBg: "bg-indigo-100",
    avatarColor: "text-indigo-600",
  },
];

export default function MemberListPage() {
  return (
    <>
      <div className="task-list w-full pb-12">
        {/* ── Tiêu đề & Nút Thêm ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-text">Quản lý Thành viên</h1>
          </div>

          <button
            type="button"
            className="flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-main px-4 text-xs font-semibold text-white shadow-sm hover:bg-main/90 transition"
          >
            <LuUserPlus size={16} />+ Cấp tài khoản mới
          </button>
        </div>

        {/* ── Bảng danh sách thành viên ───────────────────────────── */}
        <div className="mt-6 w-full overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0px_4px_16px_0px_#1018280A]">
          {/* Header bảng & Bộ lọc tĩnh */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#F1F5F9]">
            <h2 className="text-base font-bold text-text">Danh sách tài khoản trong nhóm</h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Ô tìm kiếm */}
              <label className="box flex h-[40px] w-full sm:w-[260px] items-center gap-2 rounded-[10px] border border-[#E2E8F0] px-3">
                <LuSearch size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tên hoặc email..."
                  className="w-full bg-transparent text-xs text-text outline-none placeholder:text-slate-400"
                />
              </label>

              {/* Lọc vai trò */}
              <div className="relative">
                <select className="box h-[40px] w-[160px] appearance-none rounded-[10px] border border-[#E2E8F0] bg-white pl-3 pr-8 text-xs text-[#475569] outline-none cursor-pointer">
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="USER">Thành viên</option>
                </select>
                <LuChevronDown
                  size={16}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <th className="w-[32%] px-5 py-3.5">Thành viên</th>
                  <th className="w-[24%] px-4 py-3.5">Email</th>
                  <th className="w-[16%] px-4 py-3.5">Số điện thoại</th>
                  <th className="w-[14%] px-4 py-3.5">Vai trò</th>
                  <th className="w-[14%] px-4 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9] text-sm text-text">
                {MEMBERS.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Tên & Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.avatarBg} ${m.avatarColor}`}
                        >
                          {m.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-semibold text-text truncate">
                            <span>{m.name}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8]">Tham gia {m.joined}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 font-mono text-xs text-[#475569] truncate">
                      {m.email}
                    </td>

                    {/* Số điện thoại */}
                    <td className="px-4 py-3.5 font-mono text-xs text-[#475569]">{m.phone}</td>

                    {/* Vai trò */}
                    <td className="px-4 py-3.5">
                      {m.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-main">
                          Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Thành viên
                        </span>
                      )}
                    </td>

                    {/* Thao tác (Sửa / Xóa) */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-main transition cursor-pointer"
                          title="Chỉnh sửa thông tin"
                        >
                          <LuPencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <LuTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
