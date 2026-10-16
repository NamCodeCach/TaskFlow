package com.network.kanban.service;

import com.network.kanban.dto.CreateUserRequest;
import com.network.kanban.dto.UpdateProfileRequest;
import com.network.kanban.model.User;
import com.network.kanban.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    // ─────────────────────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────────────────────

    /**
     * Xác thực đăng nhập.
     *
     * @param email    Email người dùng
     * @param password Mật khẩu plaintext
     * @return User nếu đúng
     * @throws RuntimeException nếu tài khoản không tồn tại hoặc mật khẩu sai
     */
    public User login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại trên hệ thống!"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        log.info("User đăng nhập thành công: {}", normalizedEmail);
        return user;
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────────────────────

    /**
     * Admin tạo tài khoản thành viên mới.
     * Mật khẩu được lưu plaintext (TODO: BCrypt sau).
     * mustChangePassword = true → user phải đổi mật khẩu khi login lần đầu.
     */
    @Transactional
    public User createUser(CreateUserRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email \"" + normalizedEmail + "\" đã được sử dụng trong hệ thống!");
        }

        User user = User.builder()
                .fullName(req.getFullName().trim())
                .email(normalizedEmail)
                .password(req.getPassword())
                .role(req.getRole() != null && !req.getRole().isBlank() ? req.getRole() : "user")
                .phone(req.getPhone())
                .mustChangePassword(true)   // Bắt buộc đổi mật khẩu lần đầu
                .build();

        User saved = userRepository.save(user);
        log.info("Admin tạo tài khoản mới: {} ({})", saved.getEmail(), saved.getRole());
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE PROFILE
    // ─────────────────────────────────────────────────────────────

    /**
     * Cập nhật thông tin cá nhân của user.
     * Chỉ cập nhật các field được truyền vào (non-null).
     */
    @Transactional
    public User updateProfile(String email, UpdateProfileRequest req) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + normalizedEmail));

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName().trim());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }
        if (req.getDob() != null) {
            user.setDob(req.getDob());
        }
        if (req.getIsDobLocked() != null) {
            user.setIsDobLocked(req.getIsDobLocked());
        }
        if (req.getAddress() != null) {
            user.setAddress(req.getAddress());
        }
        if (req.getIsAddressLocked() != null) {
            user.setIsAddressLocked(req.getIsAddressLocked());
        }
        if (req.getAvatar() != null) {
            user.setAvatar(req.getAvatar());
        }
        if (req.getLastAvatarChangedDate() != null) {
            user.setLastAvatarChangedDate(req.getLastAvatarChangedDate());
        }
        if (req.getLastNameChangedDate() != null) {
            user.setLastNameChangedDate(req.getLastNameChangedDate());
        }
        // Đổi mật khẩu (dùng khi user đổi mật khẩu lần đầu)
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setPassword(req.getNewPassword());
        }
        if (req.getMustChangePassword() != null) {
            user.setMustChangePassword(req.getMustChangePassword());
        }

        User saved = userRepository.save(user);
        log.info("Cập nhật profile: {}", normalizedEmail);
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────────────────────

    /** Lấy tất cả user (Admin xem danh sách thành viên) */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** Lấy thông tin một user theo email */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + email));
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────

    /** Admin xóa thành viên */
    @Transactional
    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thành viên có ID: " + id);
        }
        userRepository.deleteById(id);
        log.info("Đã xóa thành viên ID: {}", id);
    }

    // ─────────────────────────────────────────────────────────────
    // CHANGE PASSWORD (dùng khi user đổi mật khẩu từ trang change-password)
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public void changePassword(String email, String oldPassword, String newPassword) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác!");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Mật khẩu mới phải có tối thiểu 6 ký tự!");
        }
        if (newPassword.equals(oldPassword)) {
            throw new RuntimeException("Mật khẩu mới không được trùng với mật khẩu cũ!");
        }

        user.setPassword(newPassword);
        user.setMustChangePassword(false);
        userRepository.save(user);
        log.info("User đổi mật khẩu thành công: {}", normalizedEmail);
    }
}
