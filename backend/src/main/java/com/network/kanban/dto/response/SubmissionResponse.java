package com.network.kanban.dto.response;

/**
 * DTO phẳng (flattened) trả về cho frontend khi lấy danh sách bài nộp.
 * Kết hợp dữ liệu từ 3 bảng: submissions + tasks + users.
 */
public class SubmissionResponse {

    /** PK bảng submissions */
    private Long id;

    // ── Từ bảng tasks ─────────────────────────────────────────────────────
    private Long taskId;
    private String taskCode;
    private String taskTitle;
    private String taskCategory;
    /** Hạn nộp đã format: "04/10/2026 · 17:00" */
    private String deadline;

    // ── Từ bảng users (người nộp) ─────────────────────────────────────────
    private Long submittedById;
    private String submittedByName;
    /** 2 chữ cái viết tắt: "TL", "QM" */
    private String submittedByInitials;
    private String submittedByEmail;

    // ── Từ bảng submissions ───────────────────────────────────────────────
    private String note;
    private String adminFeedback;
    /** URL tải file: /api/submissions/{id}/download */
    private String filePath;
    private String originalFileName;
    private String fileSize;
    private String status;
    /** Thời điểm nộp đã format: "03/10/2026 · 10:15" */
    private String submittedAt;

    public SubmissionResponse() {}

    // ── Getters & Setters ─────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getTaskCode() { return taskCode; }
    public void setTaskCode(String taskCode) { this.taskCode = taskCode; }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }

    public String getTaskCategory() { return taskCategory; }
    public void setTaskCategory(String taskCategory) { this.taskCategory = taskCategory; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public Long getSubmittedById() { return submittedById; }
    public void setSubmittedById(Long submittedById) { this.submittedById = submittedById; }

    public String getSubmittedByName() { return submittedByName; }
    public void setSubmittedByName(String submittedByName) { this.submittedByName = submittedByName; }

    public String getSubmittedByInitials() { return submittedByInitials; }
    public void setSubmittedByInitials(String submittedByInitials) { this.submittedByInitials = submittedByInitials; }

    public String getSubmittedByEmail() { return submittedByEmail; }
    public void setSubmittedByEmail(String submittedByEmail) { this.submittedByEmail = submittedByEmail; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getAdminFeedback() { return adminFeedback; }
    public void setAdminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
}
