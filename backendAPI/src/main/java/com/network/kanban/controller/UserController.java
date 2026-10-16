package com.network.kanban.controller;

import com.network.kanban.dto.*;
import com.network.kanban.model.User;
import com.network.kanban.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST API quản lý tài khoản người dùng.
 *
 * Các endpoint:
 *   POST   /api/users/login           – Đăng nhập
 *   POST   /api/users                 – Admin tạo thành viên mới
 *   GET    /api/users                 – Admin lấy danh sách thành viên
 *   GET    /api/users/{email}         – Lấy thông tin một user
 *   PUT    /api/users/{email}/profile – Cập nhật profile
 *   POST   /api/users/{email}/change-password – Đổi mật khẩu
 *   DELETE /api/users/{id}            – Admin xóa thành viên
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    // ──────────────────────────────────────────────────────────
    // ĐĂNG NHẬP
    // ──────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            User user = userService.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // TẠO THÀNH VIÊN (Admin)
    // ──────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest req) {
        try {
            User user = userService.createUser(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // LẤY DANH SÁCH THÀNH VIÊN (Admin)
    // ──────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ──────────────────────────────────────────────────────────
    // LẤY THÔNG TIN MỘT USER
    // ──────────────────────────────────────────────────────────

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // CẬP NHẬT PROFILE
    // ──────────────────────────────────────────────────────────

    @PutMapping("/{email}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable String email,
            @RequestBody UpdateProfileRequest req) {
        try {
            User user = userService.updateProfile(email, req);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // ĐỔI MẬT KHẨU
    // ──────────────────────────────────────────────────────────

    @PostMapping("/{email}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable String email,
            @RequestBody Map<String, String> body) {
        try {
            userService.changePassword(
                    email,
                    body.get("oldPassword"),
                    body.get("newPassword")
            );
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // XÓA THÀNH VIÊN (Admin)
    // ──────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa thành viên thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }
}
