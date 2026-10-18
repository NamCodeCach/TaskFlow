package com.network.kanban.controller;

import com.network.kanban.dto.ApiResponse;
import com.network.kanban.dto.LoginRequest;
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

    @PostMapping("/account/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            // Truyền email, password và role vào Service kiểm tra
            User user = userService.login(req.getEmail(), req.getPassword(), req.getRole());
            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", user));
        } catch (Exception e) {
            // Nếu sai password hoặc sai role -> Trả về code = "error" để chặn luôn
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

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