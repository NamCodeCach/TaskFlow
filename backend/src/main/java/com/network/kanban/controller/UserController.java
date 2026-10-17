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
            User user = userService.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}