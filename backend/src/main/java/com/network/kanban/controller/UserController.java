package com.network.kanban.controller;

import com.network.kanban.dto.request.LoginRequest;
import com.network.kanban.dto.response.ApiResponse;
import com.network.kanban.dto.response.LoginResponse;
import com.network.kanban.model.User;
import com.network.kanban.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
}
