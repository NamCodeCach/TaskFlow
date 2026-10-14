package com.network.kanban.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TaskProgressMessage {
    private Long taskId;
    private Integer progress;
    private String reportContent;
    private String reporterName;
    private Long version;
}
