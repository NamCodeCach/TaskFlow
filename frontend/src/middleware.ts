import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware bảo vệ hệ thống:
 * 1. Kiểm tra cookie trước khi cho vào trang đăng nhập: Đã có cookie -> chuyển về trang làm việc.
 * 2. Tránh trường hợp người dùng vào bằng đường link trực tiếp mà chưa đăng nhập (Route Guard).
 * 3. Kiểm tra phân quyền vai trò (admin/user) khi truy cập các đường dẫn được bảo vệ.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("taskflow_token")?.value;
  const role = request.cookies.get("taskflow_role")?.value;

  // 1. Kiểm tra cookie trước khi cho vào trang đăng nhập (/account/login)
  if (pathname.startsWith("/account/login") || pathname === "/account") {
    if (token) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/user/task/list", request.url));
    }
    return NextResponse.next();
  }

  // 2. Chuyển hướng trang gốc "/"
  if (pathname === "/") {
    if (token) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/user/task/list", request.url));
    }
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  // 3. Tránh trường hợp người dùng vào bằng đường link trực tiếp vào khu vực admin / user
  const isProtectedRoute = pathname.startsWith("/admin") || pathname.startsWith("/user");

  if (isProtectedRoute) {
    // Không có token -> chặn truy cập và chuyển hướng về trang đăng nhập
    if (!token) {
      const loginUrl = new URL("/account/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Kiểm tra đúng vai trò
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/user/task/list", request.url));
    }

    if (pathname.startsWith("/user") && role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/account/:path*",
    "/admin/:path*",
    "/user/:path*",
  ],
};
