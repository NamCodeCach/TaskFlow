package com.network.kanban.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Gửi email mã OTP xác thực đặt lại mật khẩu
     *
     * @param toEmail địa chỉ người nhận
     * @param otp     mã OTP 6 chữ số
     */
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            // Kiểm tra xem cấu hình email đã được điền chưa
            if (fromEmail == null || fromEmail.isBlank() || fromEmail.contains("your_email")) {
                throw new RuntimeException("Chưa cấu hình tài khoản Gmail trong application.properties!");
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "TaskFlow Support");
            helper.setTo(toEmail);
            helper.setSubject("[TaskFlow] Mã xác thực đặt lại mật khẩu");

            String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;\">"
                    + "  <div style=\"text-align: center; margin-bottom: 24px;\">"
                    + "    <h2 style=\"color: #2563eb; margin: 0; font-size: 24px;\">TaskFlow</h2>"
                    + "    <p style=\"color: #64748b; font-size: 14px; margin-top: 4px;\">Hệ thống quản lý công việc nhóm</p>"
                    + "  </div>"
                    + "  <p style=\"color: #334155; font-size: 15px; line-height: 1.5;\">Xin chào,</p>"
                    + "  <p style=\"color: #334155; font-size: 15px; line-height: 1.5;\">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email <strong>" + toEmail + "</strong>.</p>"
                    + "  <p style=\"color: #334155; font-size: 15px; line-height: 1.5;\">Dưới đây là mã xác thực OTP của bạn:</p>"
                    + "  <div style=\"text-align: center; margin: 28px 0;\">"
                    + "    <div style=\"display: inline-block; padding: 14px 28px; background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8;\">"
                    +        otp
                    + "    </div>"
                    + "  </div>"
                    + "  <p style=\"color: #64748b; font-size: 13px; line-height: 1.5;\">⚠️ Mã OTP này có thời hạn sử dụng trong <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai khác.</p>"
                    + "  <p style=\"color: #64748b; font-size: 13px; line-height: 1.5;\">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email và tài khoản của bạn vẫn an toàn.</p>"
                    + "  <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />"
                    + "  <p style=\"color: #94a3b8; font-size: 12px; text-align: center; margin: 0;\">© 2026 TaskFlow. All rights reserved.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("[EMAIL SENT] Đã gửi mã OTP thành công tới: {}", toEmail);
        } catch (Exception e) {
            log.error("[EMAIL ERROR] Lỗi khi gửi email OTP tới {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
        }
    }
}
