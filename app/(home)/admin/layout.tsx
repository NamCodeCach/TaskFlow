import { Header } from "@/app/components/Header/Header";
import { Sider } from "@/app/components/Sider/Sider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
