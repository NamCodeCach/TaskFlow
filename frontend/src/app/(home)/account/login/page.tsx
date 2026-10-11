import { FaListCheck, FaRegEyeSlash } from "react-icons/fa6";
import { FormLogin } from "./FormLogin";

export default function Page() {
  return (
    <>
      <div className="m-[100px] ">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
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
            <FormLogin />
            {/* End form login */}
          </div>
        </div>
      </div>
    </>
  );
}
