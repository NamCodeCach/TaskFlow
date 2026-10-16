package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity lưu lịch sử hoạt động của Task.
 * Tương ứng với bảng [task_logs] trong SQL Server.
 */
@Entity
@Table(name = "task_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID của task liên quan */
    private Long taskId;

    /** Mã task (VD: TF-108) */
    @Column(length = 20)
    private String taskCode;

    /** Hành động được ghi lại (VD: CREATED, SUBMITTED, APPROVED, REJECTED) */
    @Column(nullable = false, length = 50)
    private String action;

    /** Email người thực hiện hành động */
    @Column(length = 150)
    private String actorEmail;

    /** Tên người thực hiện */
    @Column(length = 100)
    private String actorName;

    /** Ghi chú thêm */
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String note;

    /** Thời điểm xảy ra hành động */
    @Column(updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
