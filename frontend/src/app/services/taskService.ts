export interface Assignee {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  initials: string;
  avatar?: string;
}

export interface TaskItem {
  id: number;
  taskCode: string;
  title: string;
  description?: string;
  category?: string;
  deadline?: string;
  rawDeadline?: string;
  status: "TODO" | "SUBMITTED" | "OVERDUE" | "COMPLETED" | string;
  createdAt?: string;
  assignees: Assignee[];
  totalAssignees: number;
  totalSubmissions: number;
  approvedSubmissions: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  category?: string;
  deadline?: string;
  assigneeIds: number[];
  createdById?: number;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  role?: string;
}

import { API_BASE } from "@/app/config/api";

export const taskService = {
  /**
   * Lấy danh sách toàn bộ nhiệm vụ
   */
  async getAll(): Promise<ApiResponse<TaskItem[]>> {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  /**
   * Lấy danh sách nhiệm vụ được phân công cho một thành viên cụ thể
   */
  async getMyTasks(userId: number): Promise<ApiResponse<TaskItem[]>> {
    const res = await fetch(`${API_BASE}/api/tasks/my-tasks?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  /**
   * Lấy chi tiết một nhiệm vụ
   */
  async getById(id: number): Promise<ApiResponse<TaskItem>> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  /**
   * Tạo nhiệm vụ mới và phân công cho nhiều thành viên
   */
  async create(payload: CreateTaskPayload): Promise<ApiResponse<TaskItem>> {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Xóa nhiệm vụ
   */
  async delete(id: number): Promise<ApiResponse<number>> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  /**
   * Cập nhật trạng thái nhiệm vụ
   */
  async updateStatus(id: number, status: string): Promise<ApiResponse<TaskItem>> {
    const res = await fetch(`${API_BASE}/api/tasks/${id}/status?status=${encodeURIComponent(status)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },
};
