package com.network.kanban.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Tiện ích tạo và xác thực JSON Web Token (JWT).
 * Secret key và thời hạn token được đọc từ application.properties.
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Tạo JWT chứa email và role của người dùng.
     *
     * @param email email người dùng (subject)
     * @param role  vai trò: "user" hoặc "admin"
     * @return chuỗi JWT đã ký
     */
    public String generateToken(String email, String role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Lấy email (subject) từ token.
     *
     * @param token JWT string
     * @return email người dùng
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Lấy role từ claims của token.
     *
     * @param token JWT string
     * @return role ("user" hoặc "admin")
     */
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * Kiểm tra token còn hợp lệ (chữ ký đúng và chưa hết hạn).
     *
     * @param token JWT string
     * @return true nếu hợp lệ
     */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
