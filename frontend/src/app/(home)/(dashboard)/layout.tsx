"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/src/app/utils/cookie";
import { Header } from "@/app/components/Header/Header";
import { Sider } from "@/app/components/Sider/Sider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getCookie("taskflow_token");
    if (!token) {
      router.replace("/account/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
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
