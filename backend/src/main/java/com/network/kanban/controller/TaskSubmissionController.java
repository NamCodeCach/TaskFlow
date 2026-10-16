package com.network.kanban.controller;

import com.network.kanban.dto.ErrorMessage;
import com.network.kanban.dto.ReviewSubmissionRequest;
import com.network.kanban.model.TaskSubmission;
import com.network.kanban.service.TaskSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;


/**
 * REST API quản lý bài nộp task (file upload).
 *
 * Các endpoint:
 *   POST   /api/submissions                    – User nộp bài (multipart/form-data)
 *   GET    /api/submissions                    – Admin xem tất cả bài nộp
 *   GET    /api/submissions/my?email=...       – User xem bài nộp của mình
 *   GET    /api/submissions/task/{taskCode}    – Xem bài nộp theo task
 *   PUT    /api/submissions/{id}/status        – Admin duyệt/từ chối bài nộp
 *   DELETE /api/submissions/{id}               – Xóa bài nộp
 */
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaskSubmissionController {

    private final TaskSubmissionService service;

    // ──────────────────────────────────────────────────────────
    // NỘP BÀI (User upload file)
    // ──────────────────────────────────────────────────────────

    /**
     * Nhận file multipart từ frontend.
     * Frontend gửi: FormData với các field:
     *   - taskCode       : String
     *   - taskTitle      : String
     *   - submitterEmail : String
     *   - submitterName  : String
     *   - note           : String (optional)
     *   - file           : File (binary)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitTask(
            @RequestParam("taskCode") String taskCode,
            @RequestParam("taskTitle") String taskTitle,
            @RequestParam("submitterEmail") String submitterEmail,
            @RequestParam("submitterName") String submitterName,
            @RequestParam(value = "note", required = false, defaultValue = "") String note,
            @RequestParam("file") MultipartFile file) {
        try {
            TaskSubmission result = service.submitTask(
                    taskCode, taskTitle, submitterEmail, submitterName, note, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new ErrorMessage("Lỗi khi lưu file: " + e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // XEM TẤT CẢ BÀI NỘP (Admin)
    // ──────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<TaskSubmission>> getAllSubmissions() {
        return ResponseEntity.ok(service.getAllSubmissions());
    }

    // ──────────────────────────────────────────────────────────
    // XEM BÀI NỘP CỦA TÔI (User)
    // ──────────────────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<List<TaskSubmission>> getMySubmissions(
            @RequestParam String email) {
        return ResponseEntity.ok(service.getMySubmissions(email));
    }

    // ──────────────────────────────────────────────────────────
    // XEM BÀI NỘP THEO TASK
    // ──────────────────────────────────────────────────────────

    @GetMapping("/task/{taskCode}")
    public ResponseEntity<List<TaskSubmission>> getByTask(
            @PathVariable String taskCode) {
        return ResponseEntity.ok(service.getByTaskCode(taskCode));
    }

    // ──────────────────────────────────────────────────────────
    // DUYỆT / TỪ CHỐI BÀI NỘP (Admin)
    // ──────────────────────────────────────────────────────────

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody ReviewSubmissionRequest req) {
        try {
            TaskSubmission result = service.updateStatus(id, req);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // XÓA BÀI NỘP
    // ──────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long id) {
        try {
            service.deleteSubmission(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa bài nộp thành công!"));
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────
    // TẢI XUỐNG FILE (Admin download)
    // ──────────────────────────────────────────────────────────

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        try {
            TaskSubmission sub = service.getAllSubmissions()
                    .stream().filter(s -> s.getId().equals(id)).findFirst()
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp!"));

            if (sub.getFilePath() == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(sub.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorMessage("File không tồn tại trên server!"));
            }

            String contentType = sub.getFileType() != null
                    ? sub.getFileType() : "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + sub.getFileName() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError()
                    .body(new ErrorMessage("Lỗi đường dẫn file: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }
}
