"use client";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import {
  LuChevronLeft,
  LuChevronRight,
  LuEllipsis,
  LuSearch,
  LuSquarePen,
  LuChevronDown,
  LuCalendar,
} from "react-icons/lu";
import CheckboxWrap4 from "@/app/components/checkBox/CustomCheckBox";
import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";

export default function Page() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      {/* Title */}
      <h3 className="font-[700] text-[28px] text-text">Danh sách task</h3>
      {/* End Title */}

      {/* add task */}

      {openCreate &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-[560px] rounded-[16px] bg-white p-[24px]">
              <div className="flex justify-between">
                <h3 className="text-[20px] font-bold text-text">Tạo task mới</h3>

                <button className="cursor-pointer" onClick={() => setOpenCreate(false)}>
                  <IoClose className="w-[20px] h-[20px]" />
                </button>
              </div>

              <form className="mt-[20px] flex flex-col gap-[16px] ">
                {/* Title */}
                <div className="flex flex-col w-full gap-[8px]">
                  <label className="font-[600] text-text text-[14px]">Tiêu đề</label>
                  <input
                    type="text"
                    placeholder="Tiêu đề"
                    className="rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] outline-none"
                  />
                </div>
                {/* Mô tả */}
                <div className="flex flex-col w-full gap-[8px]">
                  <label className="font-[600] text-text text-[14px]">Mô tả</label>
                  <textarea
                    rows={4}
                    placeholder="Mô tả"
                    className="rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] outline-none"
                  />
                </div>
                {/* Giao cho */}
                <div className="flex flex-col w-full gap-[8px]">
                  <label className="font-[600] text-text text-[14px]">Giao cho</label>
                  <div className="rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] outline-none max-h-[100px] overflow-y-auto flex flex-col gap-[6px]">
                    <div className="flex items-center gap-[8px] text-text text-[13px] font-[500]">
                      <input type="checkbox" />
                      <label htmlFor="hoangthuylinh">Hoàng Thùy Linh</label>
                    </div>

                    <div className="flex items-center gap-[8px] text-text text-[13px] font-[500]">
                      <input type="checkbox" />
                      <label htmlFor="nguyenvana">Nguyễn Văn A</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-[8px]">
                  <label className="font-[600] text-text text-[14px]">Hạn nộp</label>
                  <div className="flex gap-[12px]">
                    <input
                      type="date"
                      className="w-[70%] border border-[#E2E8F0] rounded-[10px] px-[12px] py-[10px]"
                    />
                    <input
                      type="time"
                      className="flex-1 border border-[#E2E8F0] rounded-[10px] px-[12px] py-[10px]"
                    />
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-end gap-[8px]">
                  <button
                    type="button"
                    onClick={() => setOpenCreate(false)}
                    className="rounded-[10px] border border-[#E2E8F0] px-[16px] py-[10px] text-[14px] font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-[10px] bg-main px-[16px] py-[10px] text-[14px] font-semibold text-white flex items-center gap-[8px] cursor-pointer"
                  >
                    <IoIosSend />
                    Giao task
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* End add task */}

      {/* Danh sách task */}
      <div className="mt-[24px] w-full task-list">
        <div className="w-full overflow-x-auto rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0px_4px_16px_0px_#1018280A]">
          <div className="min-w-[900px]">
            {/* Tiêu đề */}

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 px-[20px] py-[20px]">
              {/* Tìm kiếm */}
              <label className="box flex min-w-[240px] flex-1 items-center gap-2 text-[#475569]">
                <LuSearch size={14} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhiệm vụ..."
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>

              {/* Trạng thái */}
              <div className="relative">
                <select className="box w-[190px] appearance-none pr-[36px] text-[#475569]">
                  <option>Trạng thái</option>
                </select>
                <LuChevronDown
                  size={16}
                  className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>

              {/* Hạn nộp */}
              <input type="date" className="box w-[170px] text-[#475569]" />

              {/* Xóa */}
              <button
                type="button"
                className="box flex cursor-pointer items-center justify-center gap-[8px] border-red-200 font-semibold text-red-600 opacity-90 hover:bg-red-50 hover:opacity-100"
              >
                <FaTrashAlt size={13} />
                Xóa
              </button>

              {/* Tạo task */}
              <button
                type="button"
                className="flex h-[42px] cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-main px-[16px] text-[13px] font-[600] text-white hover:opacity-100 opacity-100"
                onClick={() => setOpenCreate(true)}
              >
                + Tạo task
              </button>
            </div>

            {/* Bảng */}
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-y border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B]">
                  <th className="w-[56px] pl-[20px]">
                    <CheckboxWrap4 id="all" name="all" />
                  </th>
                  <th className="w-[28%]">Tên task</th>
                  <th className="w-[20%]">Người nhận</th>
                  <th className="w-[14%]">Hạn nộp</th>
                  <th className="w-[18%]">Trạng thái</th>
                  <th className="w-[12%]">Hành động</th>
                </tr>
              </thead>

              <tbody className="text-[14px] text-text">
                {/* 1: Cần làm */}
                <tr>
                  <td className="pl-[20px]">
                    <CheckboxWrap4 id="TF-108" name="TF-108" />
                  </td>
                  <td>
                    <div className="truncate font-semibold">Thiết kế banner</div>
                    <div className="mt-[2px] text-[12px] text-[#94A3B8]">TF-108 · Thiết kế</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[11px] font-bold text-[#9A3412]">
                        TL
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-full bg-[#22C55E] ring-2 ring-white" />
                      </div>
                      <span className="truncate">Thùy Linh</span>
                    </div>
                  </td>
                  <td className="${td} text-[#64748B]">05/10/2026</td>
                  <td>
                    <span className="inline-flex items-center gap-[8px] rounded-full bg-[#F1F5F9] px-[12px] py-[6px] text-[13px] font-semibold text-[#475569]">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#64748B]" />
                      Cần làm
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-[6px] text-[18px] text-[#475569]">
                      <button type="button" className="action-btn">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="action-btn">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 2: Đã nộp */}
                <tr>
                  <td className="${td} pl-[20px]">
                    <CheckboxWrap4 id="TF-107" name="TF-107" />
                  </td>
                  <td>
                    <div className="truncate font-semibold">Báo cáo hiệu quả tháng 9</div>
                    <div className="mt-[2px] text-[12px] text-[#94A3B8]">TF-107 · Báo cáo</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[11px] font-bold text-[#1E40AF]">
                        QM
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-full bg-[#9CA3AF] ring-2 ring-white" />
                      </div>
                      <span className="truncate">Quang Minh</span>
                    </div>
                  </td>
                  <td className="${td} text-[#64748B]">04/10/2026</td>
                  <td>
                    <span className="inline-flex items-center gap-[8px] rounded-full bg-[#FEF3C7] px-[12px] py-[6px] text-[13px] font-semibold text-[#B45309]">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#D97706]" />
                      Đã nộp
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-[6px] text-[18px] text-[#475569]">
                      <button type="button" className="action-btn">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="action-btn">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 3: Quá hạn */}
                <tr>
                  <td className="${td} pl-[20px]">
                    <CheckboxWrap4 id="TF-103" name="TF-103" />
                  </td>
                  <td>
                    <div className="truncate font-semibold">Cập nhật giao diện trang đích</div>
                    <div className="mt-[2px] text-[12px] text-[#94A3B8]">TF-103 · Thiết kế</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[11px] font-bold text-[#9A3412]">
                        TL
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-full bg-[#22C55E] ring-2 ring-white" />
                      </div>
                      <span className="truncate">Thùy Linh</span>
                    </div>
                  </td>
                  <td className="${td} font-medium text-[#EF4444]">02/10/2026</td>
                  <td>
                    <span className="inline-flex items-center gap-[8px] rounded-full bg-[#FEE2E2] px-[12px] py-[6px] text-[13px] font-semibold text-[#DC2626]">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
                      Quá hạn
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-[6px] text-[18px] text-[#475569]">
                      <button type="button" className="action-btn">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="action-btn">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 4: Hoàn thành */}
                <tr>
                  <td className="${td} pl-[20px]">
                    <CheckboxWrap4 id="TF-102" name="TF-102" />
                  </td>
                  <td>
                    <div className="truncate font-semibold">Hướng dẫn nhận diện thương hiệu</div>
                    <div className="mt-[2px] text-[12px] text-[#94A3B8]">TF-102 · Thiết kế</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[11px] font-bold text-[#9A3412]">
                        TL
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-full bg-[#22C55E] ring-2 ring-white" />
                      </div>
                      <span className="truncate">Thùy Linh</span>
                    </div>
                  </td>
                  <td className="${td} text-[#64748B]">01/10/2026</td>
                  <td>
                    <span className="inline-flex items-center gap-[8px] rounded-full bg-[#DCFCE7] px-[12px] py-[6px] text-[13px] font-semibold text-[#15803D]">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#16A34A]" />
                      Hoàn thành
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-[6px] text-[18px] text-[#475569]">
                      <button type="button" className="action-btn">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="action-btn">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex items-center justify-between border-t border-[#E2E8F0] px-[20px] py-[14px] text-[13px] text-[#64748B]">
              <span>Hiển thị 4 trên 4 task</span>
              <div className="flex items-center gap-[8px]">
                <button
                  type="button"
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-[16px] hover:bg-[#F1F5F9]"
                >
                  <LuChevronLeft />
                </button>
                <button
                  type="button"
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[#EEF2FF] text-[13px] font-semibold text-[#4F46E5]"
                >
                  1
                </button>
                <button
                  type="button"
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-[16px] hover:bg-[#F1F5F9]"
                >
                  <LuChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Danh sách task */}
    </>
  );
}
