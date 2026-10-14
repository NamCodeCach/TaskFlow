package com.network.kanban.dto;

import com.network.kanban.model.Task;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TaskSocketEvent {
    private String eventType; // STATUS_UPDATED, ASSIGNED, PROGRESS_UPDATED, TASK_CREATED
    private Task task;
    private String message;
    private Long timestamp;

    public TaskSocketEvent(String eventType, Task task, String message) {
        this.eventType = eventType;
        this.task = task;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }
}
