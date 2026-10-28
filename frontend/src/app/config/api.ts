/**
 * Cấu hình Endpoint Backend tự động nhận diện môi trường:
 *
 * - Truy cập từ LOCALHOST (máy chủ): http://localhost:8080
 * - Truy cập từ LAN (cùng Wi-Fi, VD: 192.168.100.58:3000): http://192.168.100.58:8080
 * - Truy cập từ VS Code Dev Tunnels (VD: xxx-3000.devtunnels.ms): https://xxx-8080.devtunnels.ms
 *
 * Không cần sửa file này khi đổi môi trường!
 */

const getApiBase = (): string => {
  if (typeof window === "undefined") {
    // Server-side rendering → dùng localhost
    return "http://localhost:8080";
  }

  const host = window.location.hostname;
  const protocol = window.location.protocol;

  // VS Code Dev Tunnels: tự đổi port 3000 → 8080 trong URL
  if (host.includes(".devtunnels.ms")) {
    return `${protocol}//${host.replace(/-3000\./, "-8080.")}`;
  }

  // Localhost bình thường
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8080";
  }

  // Mạng LAN (192.168.x.x hoặc IP bất kỳ khác): dùng đúng IP đó
  return `${protocol}//${host}:8080`;
};

const getWsBase = (): string => {
  if (typeof window === "undefined") {
    return "ws://localhost:8080/ws";
  }

  const host = window.location.hostname;
  const isSecure = window.location.protocol === "https:";
  const wsProtocol = isSecure ? "wss:" : "ws:";

  // VS Code Dev Tunnels
  if (host.includes(".devtunnels.ms")) {
    return `${wsProtocol}//${host.replace(/-3000\./, "-8080.")}/ws`;
  }

  // Localhost
  if (host === "localhost" || host === "127.0.0.1") {
    return "ws://localhost:8080/ws";
  }

  // Mạng LAN
  return `${wsProtocol}//${host}:8080/ws`;
};

export const API_BASE = getApiBase();
export const WS_BASE = getWsBase();
