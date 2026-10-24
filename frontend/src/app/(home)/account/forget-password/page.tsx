import { FaListCheck } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ForgetPasswordForm } from "./ForgetPasswordForm";

export default function ForgetPasswordPage() {
  return (
    <>
      <div className="m-[60px] md:m-[100px]">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[32px] md:p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-[24px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[26px] font-bold text-text text-center">Quên mật khẩu?</h3>

            <p className="text-[14px] text-[#475569] text-center mt-2">
              Nhập email tài khoản của bạn để nhận mã xác thực OTP đặt lại mật khẩu.
            </p>

            {/* Form */}
            <ForgetPasswordForm />

            {/* Hint */}
            <div className="flex items-center justify-center gap-[12px] p-[16px] rounded-[12px] bg-[#F8FAFC] text-[13px] text-[#475569] font-light mt-[24px]">
              <IoMdInformationCircleOutline className="h-[24px] w-[24px] shrink-0 text-main" />
              <p>
                Nếu không nhận được mã trong hòm thư đến, vui lòng kiểm tra mục Thư rác (Spam) hoặc thử lại sau vài phút.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
