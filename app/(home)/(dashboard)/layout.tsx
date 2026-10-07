import { Header } from "@/app/components/Header/Header";
import { Sider } from "@/app/components/Sider/Sider";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      {/* Header */}
      <Header />
      {/* End Header */}

      <body>{children}</body>

      {/* Sider */}
      <Sider />
      {/* End Sider */}
    </html>
  );
}
