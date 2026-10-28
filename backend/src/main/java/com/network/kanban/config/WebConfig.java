package com.network.kanban.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình CORS toàn cục cho phép frontend (localhost:3000)
 * giao tiếp với backend (localhost:8080).
 *
 * Dùng WebMvcConfigurer.addCorsMappings – cách chính thống của Spring MVC,
 * đảm bảo header Access-Control-Allow-Origin được gửi đúng cho cả
 * preflight OPTIONS và các request thực tế GET/POST/PUT.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Cho phép localhost và tên miền Vercel production
                .allowedOriginPatterns("http://localhost:3000", "https://*.vercel.app", "*")
                // Tất cả methods cần thiết
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                // Tất cả headers
                .allowedHeaders("*")
                // Cho phép credentials (cookie / Authorization)
                .allowCredentials(true)
                // Cache preflight 1 giờ
                .maxAge(3600);
    }
}
