package com.network.kanban.dto;

import lombok.Data;

/** Request body cho PUT /api/users/{email}/profile – Cập nhật thông tin cá nhân */
@Data
public class UpdateProfileRequest {

    private String fullName;
    private String phone;
    private String dob;
    private Boolean isDobLocked;
    private String address;
    private Boolean isAddressLocked;

    /** Base64 encoded avatar image */
    private String avatar;

    private String lastAvatarChangedDate;
    private String lastNameChangedDate;

    /** Đổi mật khẩu – nếu null thì giữ nguyên */
    private String newPassword;
    private Boolean mustChangePassword;
}
