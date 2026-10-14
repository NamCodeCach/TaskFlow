package com.network.kanban.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TaskStatusUpdateMessage {
    private Long taskId;
    private String newStatus;
    private Long version;
    private String updatedBy;
}
