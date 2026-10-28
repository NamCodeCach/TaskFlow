/**
 * types.ts
 * Chứa toàn bộ định nghĩa kiểu dữ liệu (TypeScript interfaces),
 * hằng số cấu hình trạng thái, và hàm tiện ích cho trang /admin/submit-task/list.
 */

export const API_BASE = "http://localhost:8080";

export type SubmissionStatus = "submitted" | "approved" | "resubmit_requested";

/**
 * Ánh xạ dữ liệu bài nộp từ backend API (SubmissionResponse.java).
 */
export interface SubmissionItem {
  id: number;
  taskId?: number;
  taskCode: string;
  taskTitle: string;
  taskCategory: string;
  deadline: string;
  submittedById?: number;
  submittedByName: string;
  submittedByInitials: string;
  submittedByEmail: string;
  note: string;
  adminFeedback?: string;
  filePath: string;
  originalFileName: string;
  fileSize: string;
  status: SubmissionStatus;
  submittedAt: string;
}

/**
 * Định dạng chuẩn của ApiResponse từ backend.
 */
export interface ApiResponse<T> {
  code: "success" | "error";
  message: string;
  data: T;
  role?: string | null;
}

/**
 * Nhãn hiển thị tiếng Việt tương ứng với từng trạng thái.
 */
export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  submitted: "Chờ duyệt",
  approved: "Hoàn thành",
  resubmit_requested: "Yêu cầu nộp lại",
};

/**
 * Cấu hình style badge cho từng trạng thái theo chuẩn thiết kế giao diện.
 */
export const STATUS_BADGE: Record<
  SubmissionStatus,
  { wrapper: string; dot: string }
> = {
  submitted: {
    wrapper:
      "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700",
    dot: "h-1.5 w-1.5 rounded-full bg-amber-500",
  },
  approved: {
    wrapper:
      "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700",
    dot: "h-1.5 w-1.5 rounded-full bg-emerald-500",
  },
  resubmit_requested: {
    wrapper:
      "inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700",
    dot: "h-1.5 w-1.5 rounded-full bg-rose-500",
  },
};

/**
 * Bảng màu avatar luân phiên dựa trên mã hash của email (ổn định qua các lần render).
 */
export const AVATAR_COLORS = [
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-cyan-100", text: "text-cyan-600" },
];

export function getAvatarColor(email: string) {
  if (!email) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
