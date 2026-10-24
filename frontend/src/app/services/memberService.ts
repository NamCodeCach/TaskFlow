export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMemberPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface UpdateMemberPayload {
  fullName: string;
  phone?: string;
  role?: string;
}

export interface ApiResponse<T = any> {
  code: "success" | "error";
  message: string;
  data?: T;
}

const API_BASE = "http://localhost:8080";

export const memberService = {
  /**
   * Lấy toàn bộ danh sách thành viên từ CSDL (dữ liệu động)
   */
  async getAll(): Promise<ApiResponse<Member[]>> {
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Lỗi kết nối máy chủ (${res.status})`);
      return await res.json();
    } catch (err: any) {
      return {
        code: "error",
        message: err.message || "Không thể tải danh sách thành viên!",
        data: [],
      };
    }
  },

  /**
   * Cấp tài khoản mới cho thành viên
   */
  async create(payload: CreateMemberPayload): Promise<ApiResponse<Member>> {
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Lỗi kết nối máy chủ (${res.status})`);
      return await res.json();
    } catch (err: any) {
      return {
        code: "error",
        message: err.message || "Không thể cấp tài khoản thành viên!",
      };
    }
  },

  /**
   * Chỉnh sửa thông tin thành viên (Họ và tên, SĐT, Vai trò)
   */
  async update(id: number, payload: UpdateMemberPayload): Promise<ApiResponse<Member>> {
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Lỗi kết nối máy chủ (${res.status})`);
      return await res.json();
    } catch (err: any) {
      return {
        code: "error",
        message: err.message || "Không thể cập nhật thành viên!",
      };
    }
  },

  /**
   * Xóa tài khoản thành viên
   */
  async delete(id: number): Promise<ApiResponse<number>> {
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Lỗi kết nối máy chủ (${res.status})`);
      return await res.json();
    } catch (err: any) {
      return {
        code: "error",
        message: err.message || "Không thể xóa thành viên!",
      };
    }
  },
};
