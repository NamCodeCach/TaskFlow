/**
 * Service kết nối API xác thực & tài khoản với dữ liệu động từ Backend
 */

export interface LoginPayload {
  email: string;
  password: string;
  role: string;
  rememberMe?: boolean;
}

export interface UserAccount {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  avatar: string | null;
  mustChangePassword?: boolean;
}

export interface LoginSuccessData extends UserAccount {
  token: string;
  expiresIn: number;
}

export interface ApiResponse<T = any> {
  code: "success" | "error";
  message: string;
  data?: T;
}

const API_BASE = "http://localhost:8080";

export const authService = {
  /**
   * Đăng nhập với email, mật khẩu (sẽ được giải mã ở backend) và vai trò
   */
  async login(payload: LoginPayload): Promise<ApiResponse<LoginSuccessData>> {
    try {
      const response = await fetch(`${API_BASE}/api/users/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi trạng thái: ${response.status}`);
      }

      const data: ApiResponse<LoginSuccessData> = await response.json();
      return data;
    } catch (error: any) {
      return {
        code: "error",
        message: error.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau!",
      };
    }
  },

  /**
   * Lấy thông tin tài khoản người dùng theo email (dữ liệu động từ DB)
   */
  async getAccount(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE}/api/users/account/${encodeURIComponent(email)}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Lỗi kết nối: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      return {
        code: "error",
        message: error.message || "Lỗi tải thông tin tài khoản",
      };
    }
  },
};
