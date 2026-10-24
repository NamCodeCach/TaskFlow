package com.network.kanban.dto.response;

/**
 * DTO trả về sau khi đăng nhập thành công.
 * Frontend lưu {@code token} vào localStorage để gửi kèm mỗi request.
 */
public class LoginResponse {

    /** JWT access token */
    private String token;

    /** Thời hạn token tính bằng giây (client tự tính thời điểm hết hạn) */
    private long expiresIn;

    /** ID người dùng */
    private Long userId;

    /** Họ tên */
    private String fullName;

    /** Email */
    private String email;

    /** Vai trò: "user" hoặc "admin" */
    private String role;

    /** Avatar base64 (có thể null) */
    private String avatar;

    /** Bắt buộc đổi mật khẩu lần đầu */
    private Boolean mustChangePassword;

    public LoginResponse() {}

    public LoginResponse(String token, long expiresIn,
                         Long userId, String fullName, String email,
                         String role, String avatar, Boolean mustChangePassword) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
        this.mustChangePassword = mustChangePassword;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Boolean getMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(Boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }
}
