package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity ánh xạ bảng [tasks] trong SQL Server.
 * Một task có thể được phân công cho nhiều thành viên (qua bảng trung gian task_assignees).
 * Một task có thể có nhiều bài nộp (qua bảng submissions).
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

    /** Mô tả chi tiết yêu cầu công việc */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Danh mục, ví dụ: "Thiết kế", "Báo cáo", "Phát triển" */
    @Column(length = 100)
    private String category;

    /** Hạn nộp */
    @Column
    private LocalDateTime deadline;

    /** Trạng thái task: "active", "completed", "cancelled" */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    /** Danh sách thành viên được phân công làm task này (N-N) */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "task_assignees",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> assignees = new HashSet<>();

    /** Người tạo task (Admin) */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    /** Thời điểm tạo – tự động điền */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "active";
    }
}
