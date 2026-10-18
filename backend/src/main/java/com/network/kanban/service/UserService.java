package com.network.kanban.service;

import com.network.kanban.model.User;
import com.network.kanban.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User login(String email, String password, String role) {
        String normalizedEmail = email.trim().toLowerCase();

        // 1. Kiểm tra tài khoản tồn tại trong Database
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại trên hệ thống!"));

        // 2. Kiểm tra mật khẩu
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        // 3. KIỂM TRA ROLE BẮT BUỘC: Nếu không khớp với DB -> CHẶN LUÔN
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Vui lòng chọn vai trò đăng nhập!");
        }

        if (!user.getRole().equalsIgnoreCase(role.trim())) {
            throw new RuntimeException("Tài khoản không có quyền đăng nhập với vai trò: " + role + "!");
        }

        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
    }
}