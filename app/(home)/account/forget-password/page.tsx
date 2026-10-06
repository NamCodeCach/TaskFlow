import { FaListCheck } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";

export default function Page() {
  return (
    <>
      <div className="m-[100px] ">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            <div className="flex items-center justify-center gap-3 mb-[28px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[28px] font-bold text-text text-center ">Quên mật khẩu?</h3>

            <p className="text-[14px] text-[#475569] text-center">
              Nhập email, chúng tôi sẽ gửi liên kết đặt lại.
            </p>
            {/* form login */}
            <form action="" className="mt-[28px] flex flex-col gap-[16px] gap-[24px]">
              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email-user" className="text-[#475569] text-[14px]">
                  Email
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[10px] py-[15px]">
                  <MdOutlineEmail className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="email"
                    name="email-user"
                    id="email-user"
                    required
                    placeholder="nguyenvana@gmail.com"
                    className="w-full outline-none text-sm text-slate-700"
                  />
                </div>
              </div>
              {/* End Email */}

              <button className="flex justify-center items-center py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer opacity-100 hover:opacity-90">
                Gửi mã xác nhận
              </button>

              <div className="flex items-center justify-center  gap-[12px] p-[16px] rounded-[12px] bg-[#F8FAFC] text-[13px] text-[#475569] font-extralight">
                <IoMdInformationCircleOutline className="h-[30px] w-[30px]" />
                <p className="">
                  Nếu không nhận được email, vui lòng kiểm tra mục Thư rác (Spam) hoặc thử lại sau 2
                  phút.
                </p>
              </div>
            </form>
            {/* End form login */}
          </div>
        </div>
      </div>
    </>
  );
}
