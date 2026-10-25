package com.network.kanban.controller;

import com.network.kanban.dto.response.ApiResponse;
import com.network.kanban.dto.response.SubmissionResponse;
import com.network.kanban.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho chức năng quản lý bài nộp (phía Admin).
 *
 * Endpoints:
 *   GET  /api/submissions                       – danh sách bài nộp
 *   PUT  /api/submissions/{id}/approve          – admin duyệt hoàn thành
 *   PUT  /api/submissions/{id}/resubmit         – admin yêu cầu nộp lại
 *   GET  /api/submissions/{id}/download         – tải file đính kèm
 */
@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    // ── GET /api/submissions ──────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllSubmissions() {
        try {
            List<SubmissionResponse> list = submissionService.getAllSubmissions();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách bài nộp thành công", list));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    // ── PUT /api/submissions/{id}/approve ─────────────────────────────────
    /**
     * Admin duyệt hoàn thành bài nộp.
     *
     * @param id      id bài nộp
     * @param adminId id admin (optional, lấy từ query param ?adminId=1)
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(
            @PathVariable Long id,
            @RequestParam(required = false) Long adminId) {
        try {
            SubmissionResponse updated = submissionService.approveSubmission(id, adminId);
            return ResponseEntity.ok(ApiResponse.success("Đã duyệt hoàn thành!", updated));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    // ── PUT /api/submissions/{id}/resubmit ────────────────────────────────
    /**
     * Admin yêu cầu thành viên nộp lại.
     *
     * @param id      id bài nộp
     * @param adminId id admin (optional)
     * @param reason  lý do yêu cầu nộp lại (query param hoặc body)
     */
    @PutMapping("/{id}/resubmit")
    public ResponseEntity<?> resubmit(
            @PathVariable Long id,
            @RequestParam(required = false) Long adminId,
            @RequestParam(required = false) String reason,
            @RequestBody(required = false) java.util.Map<String, String> body) {
        try {
            String feedbackReason = reason;
            if ((feedbackReason == null || feedbackReason.isBlank()) && body != null && body.containsKey("reason")) {
                feedbackReason = body.get("reason");
            }
            SubmissionResponse updated = submissionService.requestResubmit(id, adminId, feedbackReason);
            return ResponseEntity.ok(ApiResponse.success("Đã yêu cầu nộp lại!", updated));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    // ── GET /api/submissions/{id}/download ───────────────────────────────
    /**
     * Tải file đính kèm của bài nộp.
     * Trả về file dưới dạng attachment (trình duyệt/frontend sẽ tự download).
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        try {
            Resource resource = submissionService.downloadFile(id);
            String filename = resource.getFilename() != null
                    ? resource.getFilename() : "submission-" + id;

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
