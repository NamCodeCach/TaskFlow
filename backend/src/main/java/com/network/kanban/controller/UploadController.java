package com.network.kanban.controller;

import com.network.kanban.dto.response.ApiResponse;
import com.network.kanban.dto.response.SubmissionResponse;
import com.network.kanban.model.Submission;
import com.network.kanban.model.Task;
import com.network.kanban.model.User;
import com.network.kanban.repository.SubmissionRepository;
import com.network.kanban.repository.TaskRepository;
import com.network.kanban.repository.UserRepository;
import com.network.kanban.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.DecimalFormat;
import java.util.UUID;

/**
 * REST Controller để thành viên nộp file bài.
 *
 * POST /api/upload/submit
 *   Form-data:
 *     file       – file đính kèm (required)
 *     taskId     – id task (required)
 *     userId     – id người nộp (required)
 *     note       – ghi chú (optional)
 *
 * Response: ApiResponse chứa submission id vừa tạo
 */
@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
@Slf4j
public class UploadController {

    private final SubmissionRepository submissionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SubmissionService submissionService;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTask(
            @RequestParam("file")   MultipartFile file,
            @RequestParam("taskId") Long taskId,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "note", required = false, defaultValue = "") String note) {

        try {
            // 1. Validate
            if (file.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.error("Vui lòng chọn file để nộp!"));
            }

            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy task #" + taskId));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user #" + userId));

            // 2. Lưu file vào thư mục uploads/submissions/{userId}/
            Path uploadPath = Paths.get(uploadDir, String.valueOf(userId));
            Files.createDirectories(uploadPath);

            String originalName = file.getOriginalFilename();
            String ext = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : "";
            String storedName = UUID.randomUUID() + ext;
            Path dest = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            // 3. Tính kích thước hiển thị
            String fileSize = formatFileSize(file.getSize());

            // 4. Tạo Submission entity
            Submission submission = Submission.builder()
                    .task(task)
                    .submittedBy(user)
                    .note(note != null ? note.trim() : "")
                    .filePath(dest.toString())
                    .originalFileName(originalName)
                    .fileSize(fileSize)
                    .status("submitted")
                    .build();

            Submission saved = submissionRepository.save(submission);

            // Cập nhật trạng thái task nếu đang TODO
            if ("TODO".equalsIgnoreCase(task.getStatus()) || "pending".equalsIgnoreCase(task.getStatus())) {
                task.setStatus("submitted");
                taskRepository.save(task);
            }

            // 5. Broadcast Real-time qua STOMP WebSocket tới /topic/submissions
            try {
                SubmissionResponse responseDto = submissionService.toResponse(saved);
                messagingTemplate.convertAndSend("/topic/submissions", responseDto);
                log.info("[WEBSOCKET] Đã broadcast bài nộp mới #{} tới /topic/submissions", saved.getId());
            } catch (Exception wsEx) {
                log.error("[WEBSOCKET ERROR] Lỗi broadcast bài nộp mới: {}", wsEx.getMessage());
            }

            return ResponseEntity.ok(ApiResponse.success(
                    "Nộp bài thành công!",
                    java.util.Map.of("submissionId", saved.getId())
            ));

        } catch (IOException e) {
            return ResponseEntity.ok(ApiResponse.error("Lỗi lưu file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Helper ──────────────────────────────────────────────────────────────

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        DecimalFormat df = new DecimalFormat("#.#");
        if (bytes < 1_048_576) return df.format(bytes / 1024.0) + " KB";
        if (bytes < 1_073_741_824) return df.format(bytes / 1_048_576.0) + " MB";
        return df.format(bytes / 1_073_741_824.0) + " GB";
    }
}
