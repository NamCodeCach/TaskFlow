package com.network.kanban.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Tiêu đề nhiệm vụ không được để trống")
    private String title;

    private String description;

    private String category;

    /** Định dạng: "YYYY-MM-DDTHH:mm" hoặc "YYYY-MM-DD HH:mm:ss" */
    private String deadline;

    /** Danh sách ID thành viên được phân công làm task này (ít nhất 1 người) */
    @NotEmpty(message = "Vui lòng chọn ít nhất một thành viên để giao việc")
    private List<Long> assigneeIds;

    /** ID của Admin tạo task */
    private Long createdById;
}
