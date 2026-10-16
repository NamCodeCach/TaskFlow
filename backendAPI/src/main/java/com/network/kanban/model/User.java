package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho tài khoản người dùng trong hệ thống TaskFlow.
 * Tương ứng với bảng [users] trong SQL Server.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Họ và tên đầy đủ */
    @Column(nullable = false, length = 100)
    private String fullName;

    /** Email đăng nhập – duy nhất */
    @Column(unique = true, nullable = false, length = 150)
    private String email;

    /** Mật khẩu (plaintext tạm thời – nên chuyển sang BCrypt sau) */
    @Column(nullable = false, length = 255)
    private String password;

    /** Vai trò: "user" hoặc "admin" */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String role = "user";

    /** Số điện thoại */
    @Column(length = 20)
    private String phone;

    /** Ngày sinh (định dạng dd/MM/yyyy) */
    @Column(length = 20)
    private String dob;

    /** Địa chỉ thường trú */
    @Column(length = 500)
    private String address;

    /**
     * Ảnh đại diện – lưu dạng base64 string.
     * Dùng columnDefinition = "NVARCHAR(MAX)" cho SQL Server.
     */
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String avatar;

    /** Ngày cuối đổi ảnh đại diện (định dạng yyyy-MM-dd) */
    @Column(length = 20)
    private String lastAvatarChangedDate;

    /** Ngày cuối đổi tên (định dạng yyyy-MM-dd) */
    @Column(length = 20)
    private String lastNameChangedDate;

    /** Ngày sinh đã bị khóa, chỉ Admin mới mở được */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDobLocked = false;

    /** Địa chỉ đã bị khóa, chỉ Admin mới mở được */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isAddressLocked = false;

    /**
     * Cờ bắt buộc đổi mật khẩu lần đầu đăng nhập.
     * Admin tạo tài khoản → set = true → User phải đổi mật khẩu khi login lần đầu.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean mustChangePassword = false;

    /** Thời điểm tạo tài khoản – tự động điền */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (role == null) role = "user";
        if (isDobLocked == null) isDobLocked = false;
        if (isAddressLocked == null) isAddressLocked = false;
        if (mustChangePassword == null) mustChangePassword = false;
    }
}
