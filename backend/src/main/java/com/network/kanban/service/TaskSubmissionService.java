package com.network.kanban.service;

import com.network.kanban.dto.ReviewSubmissionRequest;
import com.network.kanban.model.TaskSubmission;
import com.network.kanban.repository.TaskSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskSubmissionService {

    private final TaskSubmissionRepository submissionRepository;

    /** Thư mục lưu file – lấy từ application.properties */
    @Value("${app.upload.dir:uploads/submissions}")
    private String uploadDir;

    // ─────────────────────────────────────────────────────────────
    // SUBMIT (User nộp bài)
    // ─────────────────────────────────────────────────────────────

    /**
     * Nhận file từ frontend (multipart/form-data), lưu vào disk + database.
     *
     * @param taskCode       Mã task (VD: TF-108)
     * @param taskTitle      Tiêu đề task
     * @param submitterEmail Email user nộp bài
     * @param submitterName  Tên user nộp bài
     * @param note           Ghi chú (có thể null)
     * @param file           File đính kèm
     * @return TaskSubmission đã lưu
     */
    @Transactional
    public TaskSubmission submitTask(
            String taskCode,
            String taskTitle,
            String submitterEmail,
            String submitterName,
            String note,
            MultipartFile file) throws IOException {

        // 1. Validate file không rỗng
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn file để nộp bài!");
        }

        // 2. Tạo thư mục nếu chưa tồn tại
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Đã tạo thư mục upload: {}", uploadPath);
        }

        // 3. Tên file an toàn (tránh path traversal)
        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file"
        );

        // 4. Tạo tên file duy nhất bằng UUID
        String ext = "";
        int dotIdx = originalName.lastIndexOf('.');
        if (dotIdx > 0) {
            ext = originalName.substring(dotIdx); // VD: ".pdf"
        }
        String storedName = UUID.randomUUID().toString() + ext;
        Path targetPath = uploadPath.resolve(storedName);

        // 5. Lưu file vào disk
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Đã lưu file: {} → {}", originalName, targetPath);

        // 6. Lưu metadata vào database
        TaskSubmission submission = TaskSubmission.builder()
                .taskCode(taskCode)
                .taskTitle(taskTitle)
                .submitterEmail(submitterEmail.trim().toLowerCase())
                .submitterName(submitterName)
                .note(note)
                .fileName(originalName)
                .storedFileName(storedName)
                .filePath(targetPath.toString())
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .status("SUBMITTED")
                .build();

        TaskSubmission saved = submissionRepository.save(submission);
        log.info("Đã lưu bài nộp ID={} – task={} – user={}", saved.getId(), taskCode, submitterEmail);
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────────────────────

    /** Tất cả bài nộp (Admin xem) */
    public List<TaskSubmission> getAllSubmissions() {
        return submissionRepository.findAllByOrderBySubmittedAtDesc();
    }

    /** Bài nộp của một user */
    public List<TaskSubmission> getMySubmissions(String email) {
        return submissionRepository.findBySubmitterEmailOrderBySubmittedAtDesc(
                email.trim().toLowerCase()
        );
    }

    /** Bài nộp theo taskCode */
    public List<TaskSubmission> getByTaskCode(String taskCode) {
        return submissionRepository.findByTaskCode(taskCode);
    }

    // ─────────────────────────────────────────────────────────────
    // REVIEW (Admin duyệt hoặc yêu cầu nộp lại)
    // ─────────────────────────────────────────────────────────────

    /**
     * Admin duyệt hoặc từ chối bài nộp.
     *
     * @param id  ID bài nộp
     * @param req ReviewSubmissionRequest chứa status + reviewNote
     */
    @Transactional
    public TaskSubmission updateStatus(Long id, ReviewSubmissionRequest req) {
        TaskSubmission sub = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp có ID: " + id));

        sub.setStatus(req.getStatus());
        sub.setReviewNote(req.getReviewNote());
        sub.setReviewedAt(LocalDateTime.now());
        sub.setReviewedByEmail(req.getReviewedByEmail());

        TaskSubmission saved = submissionRepository.save(sub);
        log.info("Admin cập nhật bài nộp ID={} → status={}", id, req.getStatus());
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────

    /** Xóa bài nộp (và xóa file trên disk nếu tồn tại) */
    @Transactional
    public void deleteSubmission(Long id) throws IOException {
        TaskSubmission sub = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp có ID: " + id));

        // Xóa file vật lý
        if (sub.getFilePath() != null) {
            Path filePath = Paths.get(sub.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Đã xóa file: {}", filePath);
            }
        }

        submissionRepository.deleteById(id);
        log.info("Đã xóa bài nộp ID: {}", id);
    }
}
