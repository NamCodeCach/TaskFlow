import { BsStack } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { LuActivity, LuFolderCheck } from "react-icons/lu";
import { MdChecklist } from "react-icons/md";
import { LuSquarePen, LuEllipsis, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Link from "next/link";

export default function Page() {
  return (
    <>
      {/* Section 1 */}
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[700] text-[28px] text-text">Tổng quan</h3>
        <p className="font-[400] text-[14px] text-[#687386]">
          Theo dõi tiến độ, giao task và kết nối cùng đội ngũ.
        </p>
      </div>
      {/* End Section 1 */}

      {/* Section 2 */}
      <div className="flex items-center flex-wrap gap-[18px] mt-[20px]">
        {/* Tổng task */}
        <div className="rounded-[16px] border-[1px] border-[#E2E8F0] bg-[#FFFFFF] p-[20px] shadow-[0px_4px_16px_0px_#1018280A] w-[276.5px]">
          <div className="flex items-center justify-between text-[14px] font-medium text-[#475569]">
            Tổng task
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#EEF2FF] text-[18px] text-[#4F46E5]">
              <BsStack />
            </div>
          </div>

          <div className="mt-[20px] flex items-end gap-[10px] text-[36px] font-bold leading-[1] text-[#182230]">
            8
            <span className="pb-[4px] text-[12px] font-normal leading-[1] text-[#64748B]">
              Tháng 10/2026
            </span>
          </div>
        </div>

        {/* Cần làm */}
        <div className="rounded-[16px] border-[1px] border-[#E2E8F0] bg-[#FFFFFF] p-[20px] shadow-[0px_4px_16px_0px_#1018280A] w-[276.5px]">
          <div className="flex items-center justify-between text-[14px] font-medium text-[#475569]">
            Cần làm
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#F1F5F9] text-[18px] text-[#475569]">
              <MdChecklist />
            </div>
          </div>

          <div className="mt-[20px] flex items-end gap-[10px] text-[36px] font-bold leading-[1] text-[#182230]">
            3
            <span className="pb-[4px] text-[12px] font-normal leading-[1] text-[#64748B]">
              1 task khác đã quá hạn
            </span>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="rounded-[16px] border-[1px] border-[#E2E8F0] bg-[#FFFFFF] p-[20px] shadow-[0px_4px_16px_0px_#1018280A] w-[276.5px]">
          <div className="flex items-center justify-between text-[14px] font-medium text-[#475569]">
            Đã nộp
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#FFF5DB] text-[18px] text-[#B77914]">
              <LuFolderCheck />
            </div>
          </div>

          <div className="mt-[20px] flex items-end gap-[10px] text-[36px] font-bold leading-[1] text-[#182230]">
            3
            <span className="pb-[4px] text-[12px] font-normal leading-[1] text-[#64748B]">
              Đang chờ bạn duyệt
            </span>
          </div>
        </div>

        {/* Hoàn thành */}
        <div className="rounded-[16px] border-[1px] border-[#E2E8F0] bg-[#FFFFFF] p-[20px] shadow-[0px_4px_16px_0px_#1018280A] w-[276.5px]">
          <div className="flex items-center justify-between text-[14px] font-medium text-[#475569]">
            Hoàn thành
            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#DCFCE7] text-[16px] text-[#16A34A]">
              <FaCheck />
            </div>
          </div>

          <div className="mt-[20px] flex items-end gap-[10px] text-[36px] font-bold leading-[1] text-[#182230]">
            2
            <span className="pb-[4px] text-[12px] font-normal leading-[1] text-[#64748B]">
              25% tổng số task
            </span>
          </div>
        </div>
      </div>
      {/* End Section 2 */}

      {/* Add task */}
      <button className="flex items-center justify-center gap-[8px] rounded-[12px] px-[16px] py-[11px] text-[13px] font-[600] text-white bg-main mt-[24px] cursor-pointer">
        + Tạo task
      </button>
      {/* End Add task */}

      {/* Danh sách task */}
      <div className="flex items-start justify-start  mt-[24px] gap-[8px]">
        {/* Task list */}
        <div className="w-full max-w-[1100px] overflow-hidden rounded-[16px] border-[1px] border-[#E2E8F0] bg-[#FFFFFF] shadow-[0px_4px_16px_0px_#1018280A] ">
          {/* Tiêu đề */}
          <div className="flex flex-wrap items-center justify-between gap-[8px] px-[20px] py-[18px]">
            <div className="flex items-center gap-[8px]">
              <h2 className="text-[18px] font-bold text-[#182230]">Danh sách task</h2>
              <span className="text-[13px] text-[#64748B]">8 task</span>
            </div>
            <span className="text-[13px] font-medium text-[#4F46E5]">Cập nhật vừa xong</span>
          </div>

          {/* Bảng */}
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFC] text-[13px] font-medium text-[#64748B]">
                  <th className="w-[180px] whitespace-nowrap px-[20px] py-[14px] font-medium">
                    Tên task
                  </th>
                  <th className="w-[140px] whitespace-nowrap px-[12px] py-[14px] font-medium">
                    Người nhận
                  </th>
                  <th className="w-[90px] whitespace-nowrap px-[12px] py-[14px] font-medium">
                    Hạn nộp
                  </th>
                  <th className="w-[130px] whitespace-nowrap px-[12px] py-[14px] font-medium">
                    Trạng thái
                  </th>
                  <th className="w-[80px] whitespace-nowrap px-[12px] py-[14px] font-medium">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="text-[14px] text-[#182230]">
                {/* 1 */}
                <tr className="border-t-[1px] border-[#E2E8F0]">
                  <td className="px-[20px] py-[12px]">
                    <div className="font-semibold">Thiết kế banner</div>
                    <div className="text-[12px] text-[#94A3B8]">TF-108 · Thiết kế</div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-[#FEE2E2] text-[11px] font-bold text-[#9A3412]">
                        TL
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-[50%] bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
                      </div>
                      Thùy Linh
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] text-[#64748B]">05/10/2026</td>
                  <td className="px-[12px] py-[12px]">
                    <span className="inline-flex items-center gap-[8px] rounded-[999px] bg-[#F1F5F9] px-[12px] py-[6px] text-[13px] font-semibold text-[#475569]">
                      <span className="h-[6px] w-[6px] rounded-[50%] bg-[#64748B]" />
                      Cần làm
                    </span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[14px] text-[18px] text-[#475569]">
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuEllipsis />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 2 */}
                <tr className="border-t-[1px] border-[#E2E8F0]">
                  <td className="px-[20px] py-[12px]">
                    <div className="font-semibold">Báo cáo hiệu quả tháng 9</div>
                    <div className="text-[12px] text-[#94A3B8]">TF-107 · Báo cáo</div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-[#DBEAFE] text-[11px] font-bold text-[#1E40AF]">
                        QM
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-[50%] bg-[#9CA3AF] ring-[2px] ring-[#FFFFFF]" />
                      </div>
                      Quang Minh
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] text-[#64748B]">04/10/2026</td>
                  <td className="px-[12px] py-[12px]">
                    <span className="inline-flex items-center gap-[8px] rounded-[999px] bg-[#FEF3C7] px-[12px] py-[6px] text-[13px] font-semibold text-[#B45309]">
                      <span className="h-[6px] w-[6px] rounded-[50%] bg-[#D97706]" />
                      Đã nộp
                    </span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[14px] text-[18px] text-[#475569]">
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuEllipsis />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 3: Quá hạn */}
                <tr className="border-t-[1px] border-[#E2E8F0]">
                  <td className="px-[20px] py-[12px]">
                    <div className="font-semibold">Cập nhật giao diện trang đích</div>
                    <div className="text-[12px] text-[#94A3B8]">TF-103 · Thiết kế</div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-[#FEE2E2] text-[11px] font-bold text-[#9A3412]">
                        TL
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-[50%] bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
                      </div>
                      Thùy Linh
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] text-[#EF4444]">02/10/2026</td>
                  <td className="px-[12px] py-[12px]">
                    <span className="inline-flex items-center gap-[8px] rounded-[999px] bg-[#FEE2E2] px-[12px] py-[6px] text-[13px] font-semibold text-[#DC2626]">
                      <span className="h-[6px] w-[6px] rounded-[50%] bg-[#EF4444]" />
                      Quá hạn
                    </span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[14px] text-[18px] text-[#475569]">
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuEllipsis />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 4: Hoàn thành */}
                <tr className="border-t-[1px] border-[#E2E8F0]">
                  <td className="px-[20px] py-[12px]">
                    <div className="font-semibold">Hướng dẫn nhận diện thương hiệu</div>
                    <div className="text-[12px] text-[#94A3B8]">TF-102 · Thiết kế</div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-[#FEE2E2] text-[11px] font-bold text-[#9A3412]">
                        TL
                        <span className="absolute bottom-[-1px] right-[-1px] h-[9px] w-[9px] rounded-[50%] bg-[#22C55E] ring-[2px] ring-[#FFFFFF]" />
                      </div>
                      Thùy Linh
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px] text-[#64748B]">01/10/2026</td>
                  <td className="px-[12px] py-[12px]">
                    <span className="inline-flex items-center gap-[8px] rounded-[999px] bg-[#DCFCE7] px-[12px] py-[6px] text-[13px] font-semibold text-[#15803D]">
                      <span className="h-[6px] w-[6px] rounded-[50%] bg-[#16A34A]" />
                      Hoàn thành
                    </span>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center gap-[14px] text-[18px] text-[#475569]">
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuSquarePen />
                      </button>
                      <button type="button" className="hover:text-[#4F46E5]">
                        <LuEllipsis />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex items-center justify-between border-t-[1px] border-[#E2E8F0] px-[20px] py-[14px] text-[13px] text-[#64748B]">
            <span>Hiển thị 8 trên 8 task</span>
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

        {/* notify task submit */}
        <div className="max-w-[250px] shrink-0 rounded-[16px] border-[1px] border-[#E2E8F0] bg-[#FFFFFF] p-[20px] shadow-[0px_4px_16px_0px_#1018280A] lg:w-[276px]">
          {/* Tiêu đề */}
          <div className="flex items-center gap-[8px]">
            <LuActivity className="text-[20px] text-[#4F46E5]" />
            <h2 className="text-[16px] font-bold text-[#182230]">Hoạt động gần đây</h2>
          </div>

          <div className="mt-[16px] flex flex-col gap-[14px]">
            {/* 1 */}
            <div>
              <div className="text-[13px] font-semibold text-[#182230]">Thùy Linh đã nộp bài</div>
              <div className="mt-[4px] text-[14px] text-[#64748B]">Bộ bài đăng mạng xã hội</div>
              <div className="mt-[4px] text-[12px] text-[#94A3B8]">10:15 · Hôm nay</div>
            </div>

            {/* 2 */}
            <div>
              <div className="text-[13px] font-semibold text-[#182230]">Quang Minh đã nộp bài</div>
              <div className="mt-[4px] text-[14px] text-[#64748B]">Báo cáo hiệu quả tháng 9</div>
              <div className="mt-[4px] text-[12px] text-[#94A3B8]">09:10 · Hôm nay</div>
            </div>
          </div>
        </div>
      </div>
      {/* End Danh sách task */}
    </>
  );
}
