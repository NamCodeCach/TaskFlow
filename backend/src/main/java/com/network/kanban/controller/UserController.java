package com.network.kanban.controller;

import com.network.kanban.dto.request.CreateMemberRequest;
import com.network.kanban.dto.request.UpdateMemberRequest;
import com.network.kanban.dto.request.ForgotPasswordRequest;
import com.network.kanban.dto.request.LoginRequest;
import com.network.kanban.dto.request.ResetPasswordRequest;
import com.network.kanban.dto.request.VerifyOtpRequest;
import com.network.kanban.dto.response.ApiResponse;
import com.network.kanban.dto.response.LoginResponse;
import com.network.kanban.model.User;
import com.network.kanban.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "https://47d275fm-3000.asse.devtunnels.ms/", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * POST /api/users/account/login
     * <p>
     * Xác thực đăng nhập, giải mã mật khẩu từ DB và trả về thông tin tài khoản + JWT.
     */
    @PostMapping("/account/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            LoginResponse loginResponse = userService.login(
                    req.getEmail(),
                    req.getPassword(),
                    req.getRole(),
                    req.getRememberMe()
            );
            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công!", loginResponse));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/users/account/{email}
     * Lấy thông tin tài khoản theo email (dữ liệu động).
     */
    @GetMapping("/account/{email}")
    public ResponseEntity<?> getAccount(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(ApiResponse.success("Thành công", user));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/users/auth/forgot-password
     * Gửi mã OTP xác thực qua email để đặt lại mật khẩu.
     */
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        try {
            userService.sendForgotPasswordOtp(req.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Mã xác thực OTP đã được gửi về email của bạn! Vui lòng kiểm tra hộp thư.", null));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/users/auth/verify-otp
     * Kiểm tra mã OTP người dùng nhập vào.
     */
    @PostMapping("/auth/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest req) {
        try {
            userService.verifyResetOtp(req.getEmail(), req.getOtp());
            return ResponseEntity.ok(ApiResponse.success("Xác thực OTP thành công!", null));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/users/auth/reset-password
     * Đặt lại mật khẩu mới (mã hóa AES) và xóa mã OTP.
     */
    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        try {
            userService.resetPassword(req.getEmail(), req.getOtp(), req.getNewPassword());
            return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.", null));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/users
     * Lấy toàn bộ danh sách thành viên (dữ liệu động từ Database).
     */
    @GetMapping
    public ResponseEntity<?> getAllMembers() {
        try {
            List<User> members = userService.getAllMembers();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành viên thành công!", members));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/users
     * Cấp tài khoản mới cho thành viên:
     * - Mật khẩu đủ mạnh
     * - Mã hóa AES
     * - Không yêu cầu đổi mật khẩu lần đầu (mustChangePassword = false)
     */
    @PostMapping
    public ResponseEntity<?> createMember(@Valid @RequestBody CreateMemberRequest req) {
        try {
            User createdUser = userService.createMember(req);
            return ResponseEntity.ok(ApiResponse.success("Cấp tài khoản thành viên thành công!", createdUser));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PUT /api/users/{id}
     * Chỉnh sửa thông tin thành viên (Họ và tên, SĐT, Vai trò).
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id, @Valid @RequestBody UpdateMemberRequest req) {
        try {
            User updatedUser = userService.updateMember(id, req);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành viên thành công!", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * DELETE /api/users/{id}
     * Xóa tài khoản thành viên khỏi hệ thống.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        try {
            userService.deleteMember(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành viên thành công!", id));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
}
