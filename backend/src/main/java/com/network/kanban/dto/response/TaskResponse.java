package com.network.kanban.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String taskCode;
    private String title;
    private String description;
    private String category;
    /** Hạn nộp đã định dạng hiển thị: "05/10/2026 17:00" hoặc "05/10/2026" */
    private String deadline;
    private LocalDateTime rawDeadline;

    /**
     * Trạng thái tính toán của task:
     * - "TODO": Cần làm
     * - "SUBMITTED": Đã nộp
     * - "OVERDUE": Quá hạn
     * - "COMPLETED": Hoàn thành
     */
    private String status;

    /** Thời điểm tạo */
    private String createdAt;

    /** Danh sách thành viên được phân công */
    private List<AssigneeDto> assignees;

    private int totalAssignees;
    private int totalSubmissions;
    private int approvedSubmissions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssigneeDto {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String role;
        private String initials;
        private String avatar;
    }
}
