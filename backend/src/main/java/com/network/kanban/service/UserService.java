package com.network.kanban.service;

import com.network.kanban.dto.response.LoginResponse;
import com.network.kanban.model.User;
import com.network.kanban.repository.UserRepository;
import com.network.kanban.security.EncryptionUtil;
import com.network.kanban.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EncryptionUtil encryptionUtil;

    @Value("${jwt.expiration-ms:86400000}")
    private long defaultExpirationMs;

    /**
     * Xác thực đăng nhập:
     * - Tìm tài khoản theo email trong Database (dữ liệu động).
     * - GIẢI MÃ HÓA mật khẩu từ Database để so sánh với mật khẩu người dùng nhập.
     * - Kiểm tra vai trò (user/admin).
     * - Nếu người dùng chọn "Nhớ mật khẩu" (rememberMe), thời hạn là 1 ngày (86400 giây).
     *
     * @param email      email người dùng
     * @param password   mật khẩu dạng plaintext người dùng nhập
     * @param role       vai trò người dùng chọn
     * @param rememberMe cờ nhớ mật khẩu (1 ngày)
     * @return {@link LoginResponse} chứa token và thông tin người dùng
     */
    public LoginResponse login(String email, String password, String role, Boolean rememberMe) {
        String normalizedEmail = email.trim().toLowerCase();

        // 1. Kiểm tra tài khoản tồn tại trong Database
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại trên hệ thống!"));

        // 2. GIẢI MÃ HÓA MẬT KHẨU TỪ DATABASE ĐỂ KIỂM TRA
        String storedPassword = user.getPassword();
        boolean passwordMatches = false;

        try {
            // Giải mã mật khẩu mã hóa trong CSDL về plaintext
            String decryptedPassword = encryptionUtil.decrypt(storedPassword);
            passwordMatches = password.equals(decryptedPassword);
        } catch (Exception e) {
            // Nếu giải mã gặp lỗi do dữ liệu cũ chưa mã hóa: kiểm tra đối chiếu trực tiếp
            if (password.equals(storedPassword)) {
                passwordMatches = true;
                // Tự động mã hóa lại mật khẩu AES vào DB cho lần sau
                user.setPassword(encryptionUtil.encrypt(password));
                userRepository.save(user);
            }
        }

        // Trường hợp mật khẩu trong DB là plaintext khớp thẳng (chưa qua mã hóa)
        if (!passwordMatches && password.equals(storedPassword)) {
            passwordMatches = true;
            // Tự động mã hóa AES và lưu lại vào DB
            user.setPassword(encryptionUtil.encrypt(password));
            userRepository.save(user);
        }

        if (!passwordMatches) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        // 3. Kiểm tra vai trò đăng nhập
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Vui lòng chọn vai trò đăng nhập!");
        }
        if (!user.getRole().equalsIgnoreCase(role.trim())) {
            String roleText = "admin".equalsIgnoreCase(role.trim()) ? "Quản trị viên" : "Thành viên";
            throw new RuntimeException("Tài khoản không có quyền đăng nhập với vai trò: " + roleText + "!");
        }

        // 4. Thời hạn cookie / token: Nếu chọn "Nhớ mật khẩu" -> 1 ngày (86400s), ngược lại -> phiên đăng nhập
        boolean isRemember = rememberMe != null && rememberMe;
        long expiresInSeconds = isRemember ? 86400L : (defaultExpirationMs / 1000);

        // 5. Sinh JWT Token
        String tokenUser = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // 6. Đóng gói response trả về frontend
        return new LoginResponse(
                tokenUser,
                expiresInSeconds,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.getMustChangePassword()
        );
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
    }
}
