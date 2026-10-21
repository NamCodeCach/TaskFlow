"use client";

import { LuLockKeyhole } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useEffect } from "react";
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";

export const FormLogin = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Tự động điền email nếu trước đó đã tích "Ghi nhớ đăng nhập"
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("taskflow_remember_email");
      const emailInput = document.getElementById("email") as HTMLInputElement | null;
      const rememberCheckbox = document.getElementById("remember") as HTMLInputElement | null;

      if (savedEmail && emailInput && rememberCheckbox) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
      }
    }

    const validator = new JustValidate("#form-login");

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
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;
        const role = event.target.role.value;
        const isRemember = event.target.remember?.checked;

        const finalData = {
          email: email,
          password: password,
          role: role,
        };

        fetch("http://localhost:8080/api/users/account/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(finalData),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              toast.error(data.message);
            } else if (data.code == "success") {
              toast.success("Đăng nhập thành công!");

              // 2. Xử lý Ghi nhớ đăng nhập:
              // Nếu tích chọn -> lưu email vào localStorage để lần sau tự điền
              // Nếu không tích -> xóa email đã nhớ
              if (isRemember) {
                localStorage.setItem("taskflow_remember_email", email);
              } else {
                localStorage.removeItem("taskflow_remember_email");
              }

              // Lưu thông tin user hiện tại
              localStorage.setItem("taskflow_current_user", JSON.stringify(data.data));

              setTimeout(() => {
                const targetRole = data.data?.role || role;
                if (targetRole == "user") router.push("/user/task/list");
                else router.push("/admin/dashboard");
              }, 1000);
            }
          });
      });

    return () => validator.destroy();
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
          <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[10px] py-[15px]">
            <MdOutlineEmail className="text-gray-400 text-[18px] shrink-0" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="nguyenvana@gmail.com"
              className="w-full outline-none text-sm text-slate-700"
            />
          </div>
        </div>
        {/* End Email */}

        {/* password */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="password" className="text-[#475569] text-[14px]">
            Mật khẩu
          </label>
          <div className="w-full flex items-center gap-2 border-[1px] border-[#E2E8F0] rounded-full px-[10px] py-[15px] text-[#94A3B8]">
            <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
            <input
              type="password"
              name="password"
              id="password"
              className="w-full outline-none text-sm text-slate-700"
            />
            <FaRegEyeSlash className="text-gray-400 text-[18px] shrink-0" />
          </div>
        </div>
        {/* End password */}

        {/* Vai trò */}
        <div className="flex w-full flex-col gap-[8px]">
          <label className="text-[#475569] text-[14px]">Vai trò</label>
          <div className="grid grid-cols-2 gap-[12px]">
            <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600]">
              <input
                type="radio"
                name="role"
                id="role-user"
                value="user"
                defaultChecked
                className="h-[16px] w-[16px] accent-main"
              />
              Thành viên
            </label>

            <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600]">
              <input
                type="radio"
                name="role"
                id="role-admin"
                value="admin"
                className="h-[16px] w-[16px] accent-main"
              />
              Quản trị viên
            </label>
          </div>
        </div>
        {/* Hết Vai trò */}

        {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-[8px]">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              defaultChecked
              className="h-[16px] w-[16px] cursor-pointer rounded-[4px] accent-main"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-[#687386] text-[14px] font-[400]"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <Link
            href="/account/forget-password"
            className="font-[500] text-[14px] text-main hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button className="flex justify-center items-center py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer opacity-100 hover:opacity-90">
          Đăng nhập
        </button>

        <div className="flex items-center justify-center text-[#475569] text-[15px] gap-[4px] flex-wrap">
          Chưa có tài khoản? Liên hệ quản trị viên của nhóm.
        </div>
      </form>
    </>
  );
};
