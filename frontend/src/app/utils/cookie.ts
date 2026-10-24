/**
 * Tiện ích quản lý Cookie an toàn cho ứng dụng TaskFlow.
 * Hỗ trợ lưu trữ token, thông tin người dùng và tùy chỉnh thời hạn hết hạn.
 */

/**
 * Lưu cookie vào trình duyệt
 * @param name Tên cookie
 * @param value Giá trị cookie
 * @param days Số ngày tồn tại (nếu 1 thì tồn tại 1 ngày = 86400 giây; nếu null/undefined thì là session cookie)
 */
export function setCookie(name: string, value: string, days?: number | null): void {
  if (typeof document === "undefined") return;

  let expires = "";
  let maxAge = "";

  if (days && days > 0) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
    maxAge = `; max-age=${Math.floor(days * 24 * 60 * 60)}`;
  }

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}${maxAge}; path=/; SameSite=Lax`;
}

/**
 * Đọc giá trị cookie theo tên
 * @param name Tên cookie
 * @returns Chuỗi giá trị hoặc null nếu không tồn tại
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

/**
 * Xóa cookie khỏi trình duyệt
 * @param name Tên cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/; SameSite=Lax`;
}
