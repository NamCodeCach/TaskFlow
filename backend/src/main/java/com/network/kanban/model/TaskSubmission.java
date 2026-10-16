package com.network.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity lưu thông tin bài nộp của User cho một Task.
 * Tương ứng với bảng [task_submissions] trong SQL Server.
 *
 * Luồng:
 *   User chọn file → Frontend gửi multipart/form-data →
 *   Backend lưu file vào thư mục uploads/ →
 *   Lưu metadata vào bảng này.
 */
@Entity
@Table(name = "task_submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ─── Thông tin Task ────────────────────────────────
    /** Mã task (VD: TF-108) */
    @Column(length = 20)
    private String taskCode;

    /** Tiêu đề task */
    @Column(length = 300)
    private String taskTitle;

    // ─── Người nộp ────────────────────────────────────
    /** Email user nộp bài */
    @Column(nullable = false, length = 150)
    private String submitterEmail;

    /** Tên user nộp bài (để hiển thị nhanh) */
    @Column(length = 100)
    private String submitterName;

    // ─── File đính kèm ────────────────────────────────
    /** Tên file gốc người dùng tải lên */
    @Column(length = 300)
    private String fileName;

    /** Tên file lưu trên server (UUID + tên gốc để tránh trùng) */
    @Column(length = 400)
    private String storedFileName;

    /** Đường dẫn tuyệt đối trên server */
    @Column(length = 500)
    private String filePath;

    /** Kích thước file (bytes) */
    private Long fileSize;

    /** MIME type (vd: application/pdf, image/png) */
    @Column(length = 100)
    private String fileType;

    // ─── Ghi chú & Trạng thái ─────────────────────────
    /** Ghi chú của user khi nộp bài */
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String note;

    /**
     * Trạng thái bài nộp:
     * SUBMITTED = Đã nộp (chờ duyệt)
     * APPROVED  = Admin duyệt hoàn thành
     * REJECTED  = Admin yêu cầu nộp lại
     */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "SUBMITTED";

    // ─── Thời gian ────────────────────────────────────
    /** Thời điểm nộp bài */
    @Column(updatable = false)
    private LocalDateTime submittedAt;

    /** Thời điểm Admin duyệt/từ chối */
    private LocalDateTime reviewedAt;

    /** Email Admin duyệt */
    @Column(length = 150)
    private String reviewedByEmail;

    /** Ghi chú của Admin khi duyệt/yêu cầu nộp lại */
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String reviewNote;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) status = "SUBMITTED";
    }
}
