package com.network.kanban.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;

/**
 * Tiện ích mã hóa và giải mã đối xứng AES.
 * Dùng để:
 * - Mã hóa mật khẩu khi lưu vào Database.
 * - Giải mã mật khẩu từ Database ra plaintext khi người dùng đăng nhập để kiểm tra.
 */
@Component
public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";

    private final String secretKey;

    public EncryptionUtil(@Value("${app.security.aes-key:TaskFlowSecretKey2026!}") String secretKey) {
        this.secretKey = secretKey;
    }

    /**
     * Mã hóa mật khẩu từ plaintext sang chuỗi Base64 AES.
     *
     * @param plainText mật khẩu dạng văn bản thuần
     * @return chuỗi Base64 đã mã hóa
     */
    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }
        try {
            SecretKeySpec keySpec = getKeySpec(secretKey);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi mã hóa mật khẩu: " + e.getMessage(), e);
        }
    }

    /**
     * Giải mã mật khẩu mã hóa từ Database về plaintext để so sánh khi đăng nhập.
     *
     * @param cipherText chuỗi mã hóa trong Database
     * @return mật khẩu dạng plaintext sau khi giải mã
     */
    public String decrypt(String cipherText) {
        if (cipherText == null || cipherText.isEmpty()) {
            return cipherText;
        }
        try {
            SecretKeySpec keySpec = getKeySpec(secretKey);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(cipherText));
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi giải mã mật khẩu: " + e.getMessage(), e);
        }
    }

    private SecretKeySpec getKeySpec(String myKey) {
        try {
            byte[] key = myKey.getBytes(StandardCharsets.UTF_8);
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            key = sha.digest(key);
            key = Arrays.copyOf(key, 16); // 128-bit key
            return new SecretKeySpec(key, ALGORITHM);
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo khóa AES: " + e.getMessage(), e);
        }
    }
}
