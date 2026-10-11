import type { Metadata } from "next";
import "../public/assets/css/globals.css";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Dự án ứng dụng quản lý công việc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
