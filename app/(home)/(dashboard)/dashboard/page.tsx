import { BsStack } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import {} from "react-icons/lu";
import { MdChecklist } from "react-icons/md";

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
    </>
  );
}
