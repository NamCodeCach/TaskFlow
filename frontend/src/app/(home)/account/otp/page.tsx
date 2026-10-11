import Link from "next/link";
import { FaArrowLeftLong, FaClock, FaRegEyeSlash } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";

export default function Page() {
  return (
    <>
      <div className="m-[100px] ">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            <h3 className="text-[28px] font-bold text-text text-center">Xác minh mã OTP</h3>

            <p className="text-[14px] text-[#475569] text-center">
              Nhập mã OTP đã gửi đến email của bạn. Mã xác minh gồm 6 chữ số.
            </p>
            {/* form login */}
            <form action="" className="mt-[28px] flex flex-col gap-[16px] gap-[24px]">
              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[12px] py-[15px]">
                  <input
                    type="email"
                    name="email-user"
                    id="email-user"
                    required
                    placeholder="0123456"
                    className="w-full outline-none text-sm text-slate-700"
                  />
                </div>
              </div>
              {/* End Email */}

              <button className="flex justify-center items-center py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer opacity-100 hover:opacity-90">
                Xác nhận
              </button>
            </form>
            {/* End form login */}
          </div>
        </div>
      </div>
    </>
  );
}
