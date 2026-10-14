package com.network.kanban.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TaskAssignMessage {
    private Long taskId;
    private Long assigneeId;
    private String assigneeName;
    private Long version;
}
