import Link from "next/link";
import { FaRegEyeSlash } from "react-icons/fa6";
import { LuLockKeyhole } from "react-icons/lu";

export default function Page() {
  return (
    <>
      <div className="m-[100px] ">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_12px_24px_0px_#0F172A08]">
            <h3 className="text-[28px] font-bold text-text text-center">Thay đổi mật khẩu</h3>
            <p className="text-[14px] text-[#475569] text-center">Vui lòng nhập mật khẩu mới.</p>
            {/* form change password */}
            <form action="" className="mt-[28px] flex flex-col gap-[16px] gap-[14px]">
              {/* password */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password-user" className="text-[#475569] text-[14px]">
                  Mật khẩu
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[10px] py-[15px] text-[#94A3B8]">
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="password"
                    name="password-user"
                    id="password-user"
                    required
                    className="w-full outline-none text-sm text-slate-700"
                  />
                  <FaRegEyeSlash className="text-gray-400 text-[18px] shrink-0" />
                </div>
              </div>
              {/* password */}

              {/* comfirm password */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password-user" className="text-[#475569] text-[14px]">
                  xác nhận mật khẩu
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[10px] py-[15px] text-[#94A3B8]">
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="password"
                    name="comfirm-password-user"
                    id="comfirm-password-user"
                    required
                    className="w-full outline-none text-sm text-slate-700"
                  />
                  <FaRegEyeSlash className="text-gray-400 text-[18px] shrink-0" />
                </div>
              </div>
              {/*End comfirm password */}

              {/* Remmeber me */}

              {/*End Remmeber me */}
              <button className="flex justify-center items-center py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer opacity-100 hover:opacity-90">
                Thay đổi mật khẩu
              </button>
            </form>
            {/* End form change password */}
          </div>
        </div>
      </div>
    </>
  );
}
