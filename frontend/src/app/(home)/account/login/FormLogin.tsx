"use client";

import { LuLockKeyhole } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useEffect } from "react";
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export const FormLogin = () => {
  const router = useRouter();
  useEffect(() => {
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

        const finalData = {
          email: email,
          password: password,
          role: role,
        };

        console.log(finalData);

        fetch("http://localhost:8080/account/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(finalData),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") toast.error(data.message);
            else if (data.code == "success") {
              setTimeout(() => {
                if (role == "user") router.push("/user/task/list");
                else router.push("/admin/dashboard");
              }, 1500);
            }
          });
      });

    return () => validator.destroy();
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />

      <form action="" className="mt-[28px] flex flex-col gap-[16px] gap-[24px]" id="form-login">
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
          <label htmlFor="password" className="text-[#475569] text-[14px]">
            Vai trò
          </label>
          <div className="grid grid-cols-2 gap-[12px]">
            <label className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border border-[#E2E8F0] px-[12px] py-[10px] text-[14px] has-[:checked]:border-main has-[:checked]:bg-[#EEF0FF] has-[:checked]:font-[600]">
              <input
                type="radio"
                name="role"
                id="role"
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
                id="role"
                value="admin"
                className="h-[16px] w-[16px] accent-main"
              />
              Quản trị viên
            </label>
          </div>
        </div>
        {/* Hết Vai trò */}

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
