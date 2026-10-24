package com.network.kanban.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Cấu hình WebSocket STOMP hỗ trợ cập nhật dữ liệu Real-time:
 * - Endpoint kết nối: ws://localhost:8080/ws
 * - Kênh phát thông báo: /topic/members
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Bật Simple Broker cho các topic bắt đầu bằng /topic
        config.enableSimpleBroker("/topic");
        // Prefix cho các thông điệp client gửi lên server
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký endpoint kết nối WebSocket cho client (cho phép frontend localhost:3000)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:3000", "*");

        // Fallback SockJS nếu client dùng SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:3000", "*")
                .withSockJS();
    }
}
