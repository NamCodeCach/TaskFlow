package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity ánh xạ bảng [tasks] trong SQL Server.
 * Một task có thể được nộp bởi nhiều thành viên (qua bảng submissions).
 */
@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Mã task, ví dụ: "TF-105" */
    @Column(nullable = false, length = 20)
    private String taskCode;

    /** Tiêu đề task */
    @Column(nullable = false, length = 300)
    private String title;

    /** Danh mục, ví dụ: "Thiết kế", "Báo cáo" */
    @Column(length = 100)
    private String category;

    /** Hạn nộp */
    @Column
    private LocalDateTime deadline;

    /** Trạng thái task: "active", "completed" */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    /** Thời điểm tạo – tự động điền */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "active";
    }
}
