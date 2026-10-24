package com.network.kanban.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateMemberRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    private String phone;

    private String role;
}
