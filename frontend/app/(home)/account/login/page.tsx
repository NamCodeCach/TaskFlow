"use client";

import { apiPost } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaListCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  LuCheck,
  LuKeyRound,
  LuLock,
  LuLockKeyhole,
  LuShieldAlert,
  LuUserCheck,
  LuX,
} from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

interface UserAccount {
  fullName: string;
  email: string;
  password?: string;
  role?: string;
  mustChangePassword?: boolean;
}

export default function LoginPage() {
  return (
    <>
      <div className="my-[40px] md:my-[80px]">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[32px] sm:p-[40px] max-w-[480px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white shadow-sm">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[26px] sm:text-[28px] font-bold text-text text-center mt-[24px]">
              Chào mừng trở lại
            </h3>

            <p className="text-[14px] text-[#475569] text-center font-[400] mt-1">
              Đăng nhập bằng tài khoản công ty do Quản trị viên cấp.
            </p>

            {/* Form Login */}
            <form autoComplete="off" noValidate className="mt-[24px] flex flex-col gap-[20px]">
              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email-user" className="text-[#475569] text-[14px] font-medium">
                  Email công ty
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[13px] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20">
                  <MdOutlineEmail className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="email"
                    name="taskflow_user_email"
                    id="email-user"
                    placeholder="nguyenvana@taskflow.vn"
                    className="w-full outline-none text-sm text-slate-700 disabled:bg-transparent disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password-user" className="text-[#475569] text-[14px] font-medium">
                  Mật khẩu
                </label>
                <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[13px] text-[#94A3B8] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20">
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    name="taskflow_user_password"
                    id="password-user"
                    required
                    placeholder="Nhập mật khẩu hoặc mật khẩu tạm thời"
                    className="w-full outline-none text-sm text-slate-700 disabled:bg-transparent disabled:text-slate-400"
                  />
                  <button
                    type="button"
                    className="text-gray-400 hover:text-slate-600 transition cursor-pointer"
                  ></button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex w-full justify-between items-center flex-wrap gap-2">
                <div className="flex gap-[8px] items-center">
                  <input
                    type="checkbox"
                    id="remember-password"
                    className="rounded accent-main h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="remember-password"
                    className="text-[#475569] text-[14px] cursor-pointer"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  href="/account/forget-password"
                  className="text-main text-[14px] font-medium hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex justify-center items-center py-[14px] w-full rounded-[12px] bg-main text-white font-bold transition shadow-sm cursor-pointer"
              >
                Đăng nhập
              </button>

              {/* Thông báo chính sách cấp tài khoản nội bộ (Đã xóa dòng đăng ký) */}
              <div className="flex flex-col items-center justify-center text-center mt-2 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl gap-1">
                <div className="flex items-center gap-1.5 text-slate-600 text-[12.5px] font-semibold">
                  <LuShieldAlert className="text-amber-500 text-sm" />
                  <span>Chưa có tài khoản công ty?</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-snug">
                  Hệ thống không mở đăng ký tự do. Vui lòng liên hệ{" "}
                  <strong>Quản trị viên (Admin)</strong> để được cấp Email & Mật khẩu tạm thời.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
