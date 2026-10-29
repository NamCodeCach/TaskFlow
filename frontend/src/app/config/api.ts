/**
 * Cấu hình Endpoint Backend:
 * - Ưu tiên đọc từ biến môi trường NEXT_PUBLIC_API_BASE (ví dụ: VS Code Dev Tunnels)
 * - Tự động nhận diện môi trường:
 *   + VS Code Dev Tunnels (xxx-3000.devtunnels.ms -> xxx-8080.devtunnels.ms)
 *   + Localhost (http://localhost:8080)
 *   + LAN IP (192.168.x.x:8080)
 */

const getApiBase = (): string => {
  // 1. Ưu tiên biến môi trường NEXT_PUBLIC_API_BASE nếu có cấu hình
  const envApi = process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE;
  if (envApi && envApi.trim() !== "") {
    return envApi.trim().replace(/\/$/, "");
  }

  // 2. Server-side rendering nếu không có biến môi trường
  if (typeof window === "undefined") {
    return "http://localhost:8080";
  }

  const host = window.location.hostname;
  const protocol = window.location.protocol;

  // 3. VS Code Dev Tunnels: tự đổi port 3000 -> 8080 trong URL
  if (host.includes(".devtunnels.ms")) {
    return `${protocol}//${host.replace(/-3000\./, "-8080.")}`;
  }

  // 4. Localhost bình thường
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8080";
  }

  // 5. Mạng LAN (192.168.x.x hoặc IP bất kỳ khác): dùng đúng IP đó
  return `${protocol}//${host}:8080`;
};

const getWsBase = (): string => {
  const base = getApiBase();

  // Chuyển đổi http/https sang ws/wss
  if (base.startsWith("https://")) {
    return `${base.replace(/^https:\/\//, "wss://")}/ws`;
  }
  if (base.startsWith("http://")) {
    return `${base.replace(/^http:\/\//, "ws://")}/ws`;
  }

  return "ws://localhost:8080/ws";
};

export const API_BASE = getApiBase();
export const WS_BASE = getWsBase();
