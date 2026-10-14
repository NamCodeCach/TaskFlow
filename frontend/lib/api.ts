/**
 * API Client – Giao tiếp với Spring Boot backend (http://localhost:8080).
 *
 * Sử dụng:
 *   import { apiPost, apiGet, apiPostForm, apiPut, apiDelete } from "@/lib/api";
 */

const API_BASE = "http://localhost:8080/api";

// ──────────────────────────────────────────────────────────
// Helper nội bộ – xử lý response
// ──────────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Lỗi ${res.status}`;
    try {
      const errBody = await res.json();
      message = errBody?.error || errBody?.message || message;
    } catch {
      // Không parse được JSON → giữ message mặc định
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────────────────
// GET
// ──────────────────────────────────────────────────────────
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<T>(res);
}

// ──────────────────────────────────────────────────────────
// POST JSON
// ──────────────────────────────────────────────────────────
export async function apiPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

// ──────────────────────────────────────────────────────────
// POST multipart/form-data (Upload file)
// KHÔNG set Content-Type header – browser sẽ tự thêm boundary
// ──────────────────────────────────────────────────────────
export async function apiPostForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  return handleResponse<T>(res);
}

// ──────────────────────────────────────────────────────────
// PUT JSON
// ──────────────────────────────────────────────────────────
export async function apiPut<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

// ──────────────────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────────────────
export async function apiDelete<T = void>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<T>(res);
}

// ──────────────────────────────────────────────────────────
// Kiểm tra backend có đang chạy không (dùng để fallback)
// ──────────────────────────────────────────────────────────
export async function isBackendAlive(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // timeout 2 giây
    });
    return res.ok || res.status === 401; // 401 cũng có nghĩa server đang chạy
  } catch {
    return false;
  }
}
