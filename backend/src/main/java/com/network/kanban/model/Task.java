package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho một Task (công việc) trong hệ thống.
 * Tương ứng với bảng [tasks] trong SQL Server.
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

    /** Mã task (VD: TF-108) – tự sinh hoặc Admin đặt */
    @Column(length = 20)
    private String taskCode;

    /** Tiêu đề task */
    @Column(nullable = false, length = 300)
    private String title;

    /** Mô tả chi tiết */
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    /**
     * Trạng thái task:
     * TODO       = Cần làm
     * SUBMITTED  = Đã nộp (chờ duyệt)
     * APPROVED   = Hoàn thành
     * OVERDUE    = Quá hạn
     * REJECTED   = Yêu cầu nộp lại
     */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "TODO";

    /** Danh mục / Nhãn (VD: Thiết kế, Báo cáo) */
    @Column(length = 100)
    private String category;

    /** Hạn nộp */
    private LocalDateTime deadline;

    /** Email người được giao task */
    @Column(length = 150)
    private String assignedToEmail;

    /** Tên người được giao (để hiển thị nhanh) */
    @Column(length = 100)
    private String assignedToName;

    /** Email Admin tạo task */
    @Column(length = 150)
    private String createdByEmail;

    /** Thời điểm tạo task */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /** Thời điểm cập nhật gần nhất */
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "TODO";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
