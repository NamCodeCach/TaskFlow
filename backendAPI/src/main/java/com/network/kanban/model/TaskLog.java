package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaskLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false)
    private String reporterName;

    @Column(nullable = false)
    private Integer oldProgress;

    @Column(nullable = false)
    private Integer newProgress;

    @Column(columnDefinition = "TEXT")
    private String reportContent;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
