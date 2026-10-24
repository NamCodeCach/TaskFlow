package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity ánh xạ bảng [submissions] trong SQL Server.
 * Lưu thông tin bài nộp của thành viên: file đính kèm, ghi chú và trạng thái duyệt.
 */
@Entity
@Table(name = "submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Task mà bài này thuộc về */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    /** Người nộp bài */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_id", nullable = false)
    private User submittedBy;

    /** Ghi chú kèm theo khi nộp */
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String note;

    /**
     * Đường dẫn file đã lưu trên filesystem
     * (tương đối theo app.upload.dir, ví dụ: uploads/submissions/abc.zip)
     */
    @Column(length = 500)
    private String filePath;

    /** Tên file gốc khi người dùng upload */
    @Column(length = 255)
    private String originalFileName;

    /** Kích thước hiển thị, ví dụ: "2.3 MB" */
    @Column(length = 20)
    private String fileSize;

    /**
     * Trạng thái bài nộp:
     * "submitted"          – đã nộp, chờ duyệt
     * "approved"           – admin đã duyệt hoàn thành
     * "resubmit_requested" – admin yêu cầu nộp lại
     */
    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "submitted";

    /** Thời điểm nộp – tự động điền khi tạo mới */
    @Column(updatable = false)
    private LocalDateTime submittedAt;

    /** Thời điểm admin duyệt */
    @Column
    private LocalDateTime reviewedAt;

    /** Admin đã thực hiện duyệt */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) submittedAt = LocalDateTime.now();
        if (status == null) status = "submitted";
    }
}
