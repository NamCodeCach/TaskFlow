import { Header } from "@/src/app/components/Header/Header";
import { Sider } from "@/src/app/components/Sider/Sider";

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
