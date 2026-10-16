package com.network.kanban.dto;

import lombok.Data;

/** Request body cho PUT /api/submissions/{id}/status – Admin duyệt bài nộp */
@Data
public class ReviewSubmissionRequest {

    /** APPROVED hoặc REJECTED */
    private String status;

    /** Ghi chú của Admin */
    private String reviewNote;

    /** Email Admin đang duyệt */
    private String reviewedByEmail;
}
