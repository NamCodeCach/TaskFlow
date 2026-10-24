package com.network.kanban.service;

import com.network.kanban.dto.response.SubmissionResponse;
import com.network.kanban.model.Submission;
import com.network.kanban.model.Task;
import com.network.kanban.model.User;
import com.network.kanban.repository.SubmissionRepository;
import com.network.kanban.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional          // ← mọi method đều chạy trong 1 transaction → LAZY load hoạt động đúng
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final DateTimeFormatter DISPLAY_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy · HH:mm");

    // =========================================================================
    // GET – Danh sách bài nộp
    // =========================================================================

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getAllSubmissions() {
        return submissionRepository.findAllByOrderBySubmittedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // PUT – Admin duyệt hoàn thành
    // =========================================================================

    public SubmissionResponse approveSubmission(Long id, Long adminUserId) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp #" + id));

        submission.setStatus("approved");
        submission.setReviewedAt(LocalDateTime.now());

        if (adminUserId != null) {
            userRepository.findById(adminUserId)
                    .ifPresent(submission::setReviewedBy);
        }

        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    // =========================================================================
    // PUT – Admin yêu cầu nộp lại
    // =========================================================================

    public SubmissionResponse requestResubmit(Long id, Long adminUserId) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp #" + id));

        submission.setStatus("resubmit_requested");
        submission.setReviewedAt(LocalDateTime.now());

        if (adminUserId != null) {
            userRepository.findById(adminUserId)
                    .ifPresent(submission::setReviewedBy);
        }

        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    // =========================================================================
    // GET – Tải file đính kèm (không cần transaction)
    // =========================================================================

    @Transactional(readOnly = true)
    public Resource downloadFile(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp #" + submissionId));

        if (submission.getFilePath() == null || submission.getFilePath().isBlank()) {
            throw new RuntimeException("Bài nộp #" + submissionId + " không có file đính kèm");
        }

        try {
            Path filePath = Paths.get(submission.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File không tồn tại hoặc không đọc được: " + filePath);
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Đường dẫn file không hợp lệ: " + e.getMessage());
        }
    }

    // =========================================================================
    // Helper – Map entity → DTO (phải gọi trong transaction để LAZY load được)
    // =========================================================================

    private SubmissionResponse toResponse(Submission s) {
        SubmissionResponse dto = new SubmissionResponse();
        dto.setId(s.getId());

        // Task fields (LAZY – cần transaction đang mở)
        Task task = s.getTask();
        if (task != null) {
            dto.setTaskCode(task.getTaskCode());
            dto.setTaskTitle(task.getTitle());
            dto.setTaskCategory(task.getCategory());
            dto.setDeadline(task.getDeadline() != null
                    ? task.getDeadline().format(DISPLAY_FORMATTER) : "");
        }

        // User (người nộp) fields (LAZY – cần transaction đang mở)
        User submitter = s.getSubmittedBy();
        if (submitter != null) {
            dto.setSubmittedByName(submitter.getFullName());
            dto.setSubmittedByEmail(submitter.getEmail());
            dto.setSubmittedByInitials(buildInitials(submitter.getFullName()));
        }

        // Submission fields
        dto.setNote(s.getNote());
        dto.setFilePath("/api/submissions/" + s.getId() + "/download");
        dto.setOriginalFileName(s.getOriginalFileName());
        dto.setFileSize(s.getFileSize());
        dto.setStatus(s.getStatus());
        dto.setSubmittedAt(s.getSubmittedAt() != null
                ? s.getSubmittedAt().format(DISPLAY_FORMATTER) : "");

        return dto;
    }

    /**
     * Viết tắt 2 ký tự từ họ tên: "Nguyễn Thùy Linh" → "TL"
     */
    private String buildInitials(String fullName) {
        if (fullName == null || fullName.isBlank()) return "??";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1)
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        String first  = parts[parts.length - 2].substring(0, 1);
        String second = parts[parts.length - 1].substring(0, 1);
        return (first + second).toUpperCase();
    }
}
