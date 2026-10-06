import Link from "next/link";
import { FaListCheck, FaRegEyeSlash } from "react-icons/fa6";
import { LuLockKeyhole } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

export default function Page() {
  return (
    <>
      <div className="m-[100px] ">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[40px] max-w-[480px] bg-[#F5F6FA] border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[28px] font-bold text-text text-center mt-[28px]">
              Chào mừng trở lại
            </h3>

            <p className="text-[14px] text-[#475569] text-center font-[400]">
              Đăng nhập để cùng nhóm biến kế hoạch thành kết quả.
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
              {/* End password */}

              {/* Remmeber me */}
              <div className="flex w-full justify-between items-center flex-wrap">
                <div className="flex gap-[8px] items-center">
                  <input type="checkbox" />
                  <label
                    htmlFor="remember-password"
                    className="text-[#475569] text-[17px] pt-[6px] cursor-pointer"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  href="/admin/account/forget-password"
                  className="text-[#475569] text-main pt-[6px] cursor-pointer"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              {/*End Remmeber me */}
              <button className="flex justify-center items-center py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer opacity-100 hover:opacity-90">
                Đăng nhập
              </button>

              <div className="flex items-center justify-center text-[#475569] text-[15px] gap-[4px] flex-wrap">
                Chưa có tài khoản? Liên hệ quản trị viên của nhóm.
              </div>
            </form>
            {/* End form login */}
          </div>
        </div>
      </div>
    </>
  );
}
