package com.network.kanban.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Channel server broadcast tới các client
        config.enableSimpleBroker("/topic", "/queue");
        // Tiền tố cho các message gửi từ client lên server
        config.setApplicationDestinationPrefixes("/app");
        // Tiền tố gửi riêng cho từng user (xử lý lỗi riêng F06)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
