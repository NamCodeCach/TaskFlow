package com.network.kanban.service;

import com.network.kanban.model.User;
import com.network.kanban.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại trên hệ thống!"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        return user;
    }
}