"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { BiChevronDown, BiRadio, BiSearch } from "react-icons/bi";
import { BsShieldCheck, BsThreeDots } from "react-icons/bs";
import { FaUserSecret } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { IoCheckmarkDoneOutline, IoClose, IoEyeOutline, IoMailOutline } from "react-icons/io5";

const members = [
  {
    name: "Nguyễn Hoàng Nam",
    initials: "HN",
    email: "nam.nguyen@taskflow.vn",
    admin: true,
    tasks: 0,
    joined: "Bạn · Tham gia 01/10/2026",
    color: "bg-indigo-100 text-main",
  },
  {
    name: "Nguyễn Thùy Linh",
    initials: "TL",
    email: "linh.nguyen@taskflow.vn",
    admin: false,
    tasks: 4,
    joined: "Tham gia 01/10/2026",
    color: "bg-rose-100 text-rose-600",
  },
  {
    name: "Trần Quang Minh",
    initials: "QM",
    email: "minh.tran@taskflow.vn",
    admin: false,
    tasks: 2,
    joined: "Tham gia 01/10/2026",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Lê Gia Huy",
    initials: "GH",
    email: "huy.le@taskflow.vn",
    admin: false,
    tasks: 1,
    joined: "Tham gia 01/10/2026",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Phạm Ngọc Anh",
    initials: "NA",
    email: "anh.pham@taskflow.vn",
    admin: false,
    tasks: 1,
    joined: "Tham gia 01/10/2026",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function ThanhVien() {
  const [openCreateMember, setOpenCreateMember] = useState(false);
  return (
    <>
      <div className="min-h-screen bg-slate-100 text-[13px] text-slate-900">
        <div className="w-full">
          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-[26px] font-bold tracking-tight">Thành viên</h1>
            <button
              className="rounded-[10px] bg-main px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-main cursor-pointer"
              onClick={() => setOpenCreateMember(true)}
            >
              + Thêm thành viên
            </button>
          </header>

          {/* Stats */}
          <section className="my-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span>Tổng thành viên</span>
                <FaUserSecret size={18} className="text-main" />
              </div>
              <div className="my-4 text-[28px] font-bold">5</div>
              <p className="text-[11px] text-slate-500">1 quản trị viên · 4 thành viên</p>
            </div>

            {/* <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Đang online</span>
              <BiRadio size={18} className="text-main" />
            </div>
            <div className="my-4 text-[28px] font-bold">3</div>
            <p className="text-[11px] text-slate-500">Sẵn sàng cộng tác cùng bạn</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Task đã giao</span>
              <LuListChecks size={18} className="text-main" />
            </div>
            <div className="my-4 text-[28px] font-bold">8</div>
            <p className="text-[11px] text-slate-500">4 thành viên đang nhận task</p>
          </div> */}
          </section>

          {/* Table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-5">
              <h2 className="text-sm font-bold">Đội ngũ sáng tạo</h2>
              <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc Email..."
                    className="h-[38px] w-full rounded-[9px] border border-slate-200 pl-3 pr-9 text-[13px] placeholder:text-slate-400 sm:w-[230px]"
                  />
                  <BiSearch
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
                <div className="relative">
                  <select className="h-[38px] w-[150px] appearance-none rounded-[9px] border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-600">
                    <option>Tất cả vai trò</option>
                    <option>Quản trị viên</option>
                    <option>Thành viên</option>
                  </select>
                  <BiChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left overflow-auto">
                <thead>
                  <tr className="bg-slate-50 text-[11.5px] text-slate-500">
                    <th className="px-5 py-3 font-medium">Tên</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Vai trò</th>
                    <th className="px-5 py-3 font-medium">Số task</th>
                    <th className="px-5 py-3 font-medium">•••</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.email} className="border-t border-slate-100">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`relative grid h-[34px] w-[34px] place-items-center rounded-full text-[11px] font-bold ${m.color}`}
                          >
                            {m.initials}
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold">{m.name}</div>
                            <div className="mt-0.5 text-[12.5px] text-slate-500">{m.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500">{m.email}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-md px-2.5 py-1 text-[13px] font-medium ${m.admin ? "bg-indigo-100 text-main" : "bg-slate-100 text-slate-500"}`}
                        >
                          {m.admin ? "Quản trị viên" : "Thành viên"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-[13px] font-bold">{m.tasks}</td>
                      <td className="px-5 py-3.5">
                        <button className="rounded-md px-2 py-1 tracking-wider text-slate-500 hover:bg-slate-100">
                          <BsThreeDots />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-5 py-4 text-[11.5px] text-slate-500">
              <span>Hiển thị 5 trên 5 thành viên</span>
              <span>Số task bao gồm tất cả trạng thái</span>
            </footer>
          </section>

          <p className="mx-1 mt-4 flex items-center gap-2 text-[11.5px] text-slate-500">
            <BsShieldCheck size={14} />
            Quản trị viên có thể giao task, duyệt bài nộp và quản lý thành viên.
          </p>
        </div>
      </div>

      {/* Thêm thành viên */}
      {openCreateMember &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-[560px] rounded-[16px] bg-white p-[24px]">
              {/* Header */}
              <div className="mt-[20px] flex justify-between">
                <div>
                  <h3 className="text-[24px] font-bold text-[#182230]">Thêm thành viên</h3>
                  <p className="mt-[8px] text-[13px] text-[#667085]">
                    Tạo tài khoản để mời thành viên vào đội ngũ.
                  </p>
                </div>

                <button className="h-fit cursor-pointer" onClick={() => setOpenCreateMember(false)}>
                  <IoClose className="h-[20px] w-[20px]" />
                </button>
              </div>

              <form className="mt-[20px] flex flex-col gap-[16px]">
                {/* Họ và tên */}
                <div className="flex w-full flex-col gap-[8px]">
                  <label className="text-[14px] font-[600] text-text">Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Khánh Linh"
                    className="rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] outline-none"
                  />
                </div>

                {/* Email */}
                <div className="flex w-full flex-col gap-[8px]">
                  <label className="text-[14px] font-[600] text-text">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="khanhlinh.nguyen@taskflow.vn"
                      className="w-full rounded-[10px] border border-[#E2E8F0] py-[10px] pl-[12px] pr-[40px] text-[14px] outline-none"
                    />
                    <IoMailOutline className="absolute right-[12px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#667085]" />
                  </div>
                </div>

                {/* Vai trò */}
                <div className="flex w-full flex-col gap-[8px]">
                  <label className="text-[14px] font-[600] text-text">Vai trò</label>
                  <div className="grid grid-cols-2 gap-[12px]">
                    <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600]">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        defaultChecked
                        className="h-[16px] w-[16px] accent-main"
                      />
                      Thành viên
                    </label>

                    <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600]">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        className="h-[16px] w-[16px] accent-main"
                      />
                      Quản trị viên
                    </label>
                  </div>
                </div>

                {/* Mật khẩu tạm thời */}
                <div className="flex w-full flex-col gap-[8px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-[600] text-text">Mật khẩu tạm thời</label>
                    <button
                      type="button"
                      className="cursor-pointer text-[13px] font-[500] text-main"
                    >
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="Tf@Linh2026!"
                      className="w-full rounded-[10px] border border-[#E2E8F0] py-[10px] pl-[12px] pr-[40px] text-[14px] outline-none"
                    />
                    <button
                      type="button"
                      className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer text-[#667085]"
                    >
                      <IoEyeOutline className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end gap-[8px] border-t border-[#E2E8F0] pt-[16px]">
                  <button
                    type="button"
                    onClick={() => setOpenCreateMember(false)}
                    className="cursor-pointer rounded-[10px] border border-[#E2E8F0] px-[16px] py-[10px] text-[14px] font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-[10px] bg-main px-[16px] py-[10px] text-[14px] font-semibold text-white"
                  >
                    Tạo tài khoản
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Hết Thêm thành viên */}
    </>
  );
}
