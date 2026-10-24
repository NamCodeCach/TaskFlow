"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaListCheck } from "react-icons/fa6";
import { LuArrowLeft, LuLock, LuMail, LuShieldAlert } from "react-icons/lu";

export default function RegisterPolicyPage() {
  const router = useRouter();

  return (
    <div className="my-[40px] md:my-[80px]">
      <div className="contain">
        <div className="flex flex-col mx-auto p-[32px] sm:p-[44px] max-w-[520px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826] text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-main text-lg text-white shadow-md">
              <FaListCheck />
            </div>
            <span className="text-2xl font-bold text-text">TaskFlow</span>
          </div>

          {/* Shield Icon Badge */}
          <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <LuShieldAlert size={32} />
          </div>

          <h3 className="text-[22px] sm:text-[24px] font-bold text-slate-800 mt-5">
            Chính sách cấp tài khoản nội bộ
          </h3>

          <div className="mt-3 text-[13.5px] text-slate-600 leading-relaxed space-y-2">
            <p>
              Hệ thống <strong>TaskFlow</strong> vận hành theo mô hình quản lý doanh nghiệp khép kín. 
              Nhằm đảm bảo an ninh thông tin, hệ thống <strong>không mở tính năng tự do đăng ký tài khoản</strong>.
            </p>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1.5 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-main font-bold">1.</span>
                <span>Tất cả tài khoản thành viên đều do <strong>Quản trị viên (Admin / IT)</strong> trực tiếp cấp phát.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-main font-bold">2.</span>
                <span>Bạn sẽ nhận được <strong>Email công ty</strong> và <strong>Mật khẩu tạm thời</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-main font-bold">3.</span>
                <span>Ở lần đăng nhập đầu tiên, bạn sẽ được yêu cầu <strong>đổi sang mật khẩu cá nhân mới</strong>.</span>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-100 text-main rounded-lg">
                <LuMail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Cần cấp tài khoản mới?</p>
                <p className="text-[11.5px] text-slate-500">Liên hệ quản trị viên: <code className="text-main font-semibold">nam.nguyen@taskflow.vn</code></p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/account/login"
              className="flex items-center justify-center gap-2 py-[13px] w-full rounded-[12px] bg-main text-white font-bold text-sm hover:opacity-95 transition shadow-sm"
            >
              <LuArrowLeft size={16} />
              Quay lại màn hình Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
