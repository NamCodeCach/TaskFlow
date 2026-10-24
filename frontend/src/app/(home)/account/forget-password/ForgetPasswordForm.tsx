import { MdOutlineEmail } from "react-icons/md";

export const ForgetPasswordForm = () => {
  return (
    <>
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
      </form>
    </>
  );
};
