package com.network.kanban.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ErrorMessage {
    private String errorCode;
    private String errorMessage;
    private Long taskId;
}
