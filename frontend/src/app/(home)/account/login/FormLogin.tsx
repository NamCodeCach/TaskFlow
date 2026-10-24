"use client";

import { LuLockKeyhole, LuLoader } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useEffect, useState } from "react";
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { authService } from "@/src/app/services/authService";
import { getCookie, setCookie } from "@/src/app/utils/cookie";

export const FormLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. KIỂM TRA COOKIES TRƯỚC KHI CHO ĐĂNG NHẬP
    // Nếu người dùng đã có cookie phiên đăng nhập hợp lệ -> Chuyển hướng ngay, không cho đăng nhập lại
    const token = getCookie("taskflow_token");
    const role = getCookie("taskflow_role");

    if (token) {
      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/task/list");
      }
      return;
    }

    // 2. Cài đặt thư viện xác thực form JustValidate
    const validator = new JustValidate("#form-login", {
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập email",
        },
        {
          rule: "email",
          errorMessage: "Email không đúng định dạng",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mật khẩu",
        },
      ])
      .onSuccess(async (event: any) => {
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        const role = event.target.role.value;
        const rememberCheckbox = document.getElementById("remember") as HTMLInputElement | null;
        const isRemember = rememberCheckbox ? rememberCheckbox.checked : false;

        setIsLoading(true);

        try {
          // Gọi API đăng nhập (Backend giải mã mật khẩu từ DB và kiểm tra)
          const result = await authService.login({
            email,
            password,
            role,
            rememberMe: isRemember,
          });

          if (result.code === "error" || !result.data) {
            // HIỂN THỊ THÔNG BÁO KHI ĐĂNG NHẬP THẤT BẠI
            toast.error(result.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
            setIsLoading(false);
            return;
          }

          // HIỂN THỊ THÔNG BÁO KHI ĐĂNG NHẬP THÀNH CÔNG
          toast.success("Đăng nhập thành công! Đang chuyển hướng...");

          // KHI CLICK VÀO NÚT NHỚ MẬT KHẨU THÌ LƯU COOKIES 1 NGÀY (86400 GIÂY)
          // Nếu không click thì lưu dưới dạng Session Cookie (hết hạn khi đóng trình duyệt)
          const cookieDays = isRemember ? 1 : null;

          setCookie("taskflow_token", result.data.token, cookieDays);
          setCookie("taskflow_role", result.data.role, cookieDays);
          setCookie("taskflow_user", JSON.stringify(result.data), cookieDays);

          // Lưu thông tin người dùng vào localStorage hỗ trợ render nhanh Sider/Header
          localStorage.setItem("taskflow_current_user", JSON.stringify(result.data));

          // Chuyển hướng người dùng dựa vào vai trò sau 800ms để người dùng kịp nhìn thông báo
          setTimeout(() => {
            const userRole = result.data?.role || role;
            if (userRole === "admin") {
              router.push("/admin/dashboard");
            } else {
              router.push("/user/task/list");
            }
          }, 800);
        } catch (error: any) {
          toast.error("Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại!");
          setIsLoading(false);
        }
      });

    return () => {
      validator.destroy();
    };
  }, [router]);

  return (
    <>
      <Toaster richColors position="top-right" />

      <form className="mt-[28px] flex flex-col gap-[24px]" id="form-login">
        {/* Email */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="email" className="text-[#475569] text-[14px]">
            Email
          </label>
          <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[13px] focus-within:border-main transition relative">
            <MdOutlineEmail className="text-gray-400 text-[18px] shrink-0" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="nguyenvan@taskflow.vn"
              className="w-full outline-none text-sm text-slate-700 bg-transparent"
              disabled={isLoading}
            />
          </div>
        </div>
        {/* End Email */}

        {/* Mật khẩu */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="password" className="text-[#475569] text-[14px]">
            Mật khẩu
          </label>
          <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[14px] py-[13px] text-[#94A3B8] focus-within:border-main transition relative">
            <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full outline-none text-sm text-slate-700 bg-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-400 hover:text-slate-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <FaRegEye className="text-[18px] shrink-0" />
              ) : (
                <FaRegEyeSlash className="text-[18px] shrink-0" />
              )}
            </button>
          </div>
        </div>
        {/* End Mật khẩu */}

        {/* Vai trò */}
        <div className="flex w-full flex-col gap-[8px]">
          <label className="text-[#475569] text-[14px]">Vai trò</label>
          <div className="grid grid-cols-2 gap-[12px]">
            <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600] transition">
              <input
                type="radio"
                name="role"
                id="role-user"
                value="user"
                defaultChecked
                disabled={isLoading}
                className="h-[16px] w-[16px] accent-main"
              />
              Thành viên
            </label>

            <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600] transition">
              <input
                type="radio"
                name="role"
                id="role-admin"
                value="admin"
                disabled={isLoading}
                className="h-[16px] w-[16px] accent-main"
              />
              Quản trị viên
            </label>
          </div>
        </div>
        {/* Hết Vai trò */}

        {/* Nhớ mật khẩu & Quên mật khẩu */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-[8px]">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              defaultChecked
              disabled={isLoading}
              className="h-[16px] w-[16px] cursor-pointer rounded-[4px] accent-main"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-[#687386] text-[14px] font-[400] select-none"
            >
              Nhớ mật khẩu (1 ngày)
            </label>
          </div>

          <Link
            href="/account/forget-password"
            className="font-[500] text-[14px] text-main hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Nút đăng nhập */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center items-center gap-2 py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading && <LuLoader className="animate-spin text-[18px]" />}
          <span>{isLoading ? "Đang xác thực..." : "Đăng nhập"}</span>
        </button>

        <div className="flex items-center justify-center text-[#475569] text-[14px] gap-[4px] flex-wrap text-center">
          Chưa có tài khoản? Liên hệ quản trị viên của nhóm để được cấp tài khoản.
        </div>
      </form>
    </>
  );
};
