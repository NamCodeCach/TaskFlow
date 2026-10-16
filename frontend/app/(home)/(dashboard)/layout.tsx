"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { Sider } from "@/app/components/Sider/Sider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Cơ chế Bảo vệ phân quyền (Route Guard): Chặn tài khoản User thường truy cập vào trang Admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserStr = localStorage.getItem("taskflow_current_user");
      let userRole = "user";

      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u.role) userRole = u.role;
        } catch {}
      }

      // Nếu đang cố tình vào các trang quản trị /admin/... nhưng tài khoản chỉ là "user"
      if (pathname.startsWith("/admin") && userRole !== "admin") {
        setIsAuthorized(false);
        alert("⚠️ TRUY CẬP BỊ TỪ CHỐI!\nTài khoản của bạn là Thành viên (User), không có quyền truy cập vào khu vực Quản trị viên (Admin).");
        router.push("/user/task/list");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-600">
        <div className="text-center">
          <p className="text-xl font-bold text-red-600">403 - Không có quyền truy cập</p>
          <p className="text-sm mt-1">Đang chuyển bạn về không gian làm việc của Thành viên...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Header />
      {/* End Header */}

      <main className="main">{children}</main>

      {/* Sider */}
      <Sider />
      {/* End Sider */}
    </>
  );
}
