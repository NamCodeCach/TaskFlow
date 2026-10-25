package com.network.kanban.service;

import com.network.kanban.dto.request.CreateTaskRequest;
import com.network.kanban.dto.response.TaskResponse;
import com.network.kanban.model.Submission;
import com.network.kanban.model.Task;
import com.network.kanban.model.User;
import com.network.kanban.repository.SubmissionRepository;
import com.network.kanban.repository.TaskRepository;
import com.network.kanban.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter DATE_ONLY_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Lấy toàn bộ danh sách task, kèm tính toán trạng thái và người được phân công.
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        List<Task> tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết một task theo ID.
     */
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));
        return mapToTaskResponse(task);
    }

    /**
     * Tạo task mới và phân công cho nhiều thành viên:
     * 1. Sinh mã task tự động (ví dụ TF-108)
     * 2. Tìm danh sách User từ assigneeIds
     * 3. Lưu Task vào CSDL (bảng tasks và task_assignees)
     * 4. Gửi email thông báo tới từng thành viên được phân công (@Async)
     * 5. Broadcast thời gian thực qua WebSocket tới kênh /topic/tasks
     */
    @Transactional
    public TaskResponse createTask(CreateTaskRequest req) {
        if (req.getAssigneeIds() == null || req.getAssigneeIds().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất một thành viên để phân công!");
        }

        // 1. Lấy danh sách thành viên được phân công
        List<User> assignees = userRepository.findAllById(req.getAssigneeIds());
        if (assignees.isEmpty()) {
            throw new RuntimeException("Không tìm thấy thành viên nào hợp lệ theo danh sách đã chọn!");
        }

        // 2. Tìm người tạo (Admin) nếu có
        User createdBy = null;
        if (req.getCreatedById() != null) {
            createdBy = userRepository.findById(req.getCreatedById()).orElse(null);
        }

        // 3. Sinh mã task tự động
        String taskCode = generateTaskCode();

        // 4. Xử lý hạn nộp
        LocalDateTime deadline = parseDeadline(req.getDeadline());

        // 5. Khởi tạo và lưu Task
        Task task = Task.builder()
                .taskCode(taskCode)
                .title(req.getTitle().trim())
                .description(req.getDescription() != null ? req.getDescription().trim() : "")
                .category(req.getCategory() != null ? req.getCategory().trim() : "Chung")
                .deadline(deadline)
                .status("active")
                .assignees(new HashSet<>(assignees))
                .createdBy(createdBy)
                .build();

        Task savedTask = taskRepository.save(task);

        // 6. Chuyển đổi sang Response
        TaskResponse response = mapToTaskResponse(savedTask);

        // 7. Gửi email thông báo bất đồng bộ tới từng thành viên
        String formattedDeadline = (deadline != null) ? deadline.format(DISPLAY_FORMATTER) : "Không có thời hạn";
        for (User user : assignees) {
            if (user.getEmail() != null && !user.getEmail().isBlank()) {
                emailService.sendTaskAssignedEmail(
                        user.getEmail(),
                        user.getFullName(),
                        savedTask.getTaskCode(),
                        savedTask.getTitle(),
                        savedTask.getCategory(),
                        formattedDeadline,
                        savedTask.getDescription()
                );
            }
        }

        // 8. Bắn sự kiện Real-time qua WebSocket tới kênh /topic/tasks
        try {
            messagingTemplate.convertAndSend("/topic/tasks", response);
            log.info("[WEBSOCKET] Đã broadcast task mới tới /topic/tasks: {}", savedTask.getTaskCode());
        } catch (Exception e) {
            log.error("[WEBSOCKET ERROR] Lỗi broadcast task: {}", e.getMessage());
        }

        return response;
    }

    /**
     * Xóa task và phát sự kiện qua WebSocket.
     */
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));

        // Xóa các bài nộp liên quan trước để tránh lỗi Foreign Key
        submissionRepository.deleteAllByTaskId(id);

        // Xóa liên kết trong bảng task_assignees
        task.getAssignees().clear();
        taskRepository.save(task);

        // Xóa task
        taskRepository.delete(task);

        // Broadcast qua WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/tasks/deleted", id);
            log.info("[WEBSOCKET] Đã broadcast xóa task ID: {}", id);
        } catch (Exception e) {
            log.error("[WEBSOCKET ERROR] Lỗi broadcast xóa task: {}", e.getMessage());
        }
    }

    /**
     * Cập nhật trạng thái task (ví dụ admin đánh dấu hoàn thành)
     */
    @Transactional
    public TaskResponse updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task với ID: " + id));

        task.setStatus(status.trim().toLowerCase());
        Task updated = taskRepository.save(task);
        TaskResponse response = mapToTaskResponse(updated);

        // Broadcast qua WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/tasks/updated", response);
            log.info("[WEBSOCKET] Đã broadcast cập nhật task: {}", updated.getTaskCode());
        } catch (Exception e) {
            log.error("[WEBSOCKET ERROR] Lỗi broadcast update task: {}", e.getMessage());
        }

        return response;
    }

    /**
     * Chuyển đổi Entity Task sang TaskResponse với trạng thái động.
     */
    private TaskResponse mapToTaskResponse(Task task) {
        // Lấy danh sách bài nộp của task
        List<Submission> submissions = submissionRepository.findAllByTaskId(task.getId());
        int totalSubmissions = submissions.size();
        long approvedCount = submissions.stream()
                .filter(s -> "approved".equalsIgnoreCase(s.getStatus()))
                .count();

        // Tính toán trạng thái hiển thị
        String status;
        if ("completed".equalsIgnoreCase(task.getStatus()) || (totalSubmissions > 0 && approvedCount == totalSubmissions)) {
            status = "COMPLETED"; // Hoàn thành
        } else if (task.getDeadline() != null && LocalDateTime.now().isAfter(task.getDeadline())) {
            status = "OVERDUE";   // Quá hạn
        } else if (totalSubmissions > 0) {
            status = "SUBMITTED"; // Đã nộp
        } else {
            status = "TODO";      // Cần làm
        }

        // Định dạng hạn nộp
        String deadlineStr = null;
        if (task.getDeadline() != null) {
            deadlineStr = task.getDeadline().format(DISPLAY_FORMATTER);
        }

        String createdAtStr = null;
        if (task.getCreatedAt() != null) {
            createdAtStr = task.getCreatedAt().format(DISPLAY_FORMATTER);
        }

        // Map Assignees
        List<TaskResponse.AssigneeDto> assigneeDtos = new ArrayList<>();
        if (task.getAssignees() != null) {
            for (User u : task.getAssignees()) {
                assigneeDtos.add(TaskResponse.AssigneeDto.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phone(u.getPhone())
                        .role(u.getRole())
                        .initials(computeInitials(u.getFullName()))
                        .avatar(u.getAvatar())
                        .build());
            }
        }

        return TaskResponse.builder()
                .id(task.getId())
                .taskCode(task.getTaskCode())
                .title(task.getTitle())
                .description(task.getDescription())
                .category(task.getCategory())
                .deadline(deadlineStr)
                .rawDeadline(task.getDeadline())
                .status(status)
                .createdAt(createdAtStr)
                .assignees(assigneeDtos)
                .totalAssignees(assigneeDtos.size())
                .totalSubmissions(totalSubmissions)
                .approvedSubmissions((int) approvedCount)
                .build();
    }

    private String computeInitials(String fullName) {
        if (fullName == null || fullName.isBlank()) return "U";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
        }
        return fullName.substring(0, Math.min(2, fullName.length())).toUpperCase();
    }

    private LocalDateTime parseDeadline(String deadlineStr) {
        if (deadlineStr == null || deadlineStr.isBlank()) return null;
        try {
            if (deadlineStr.contains("T")) {
                return LocalDateTime.parse(deadlineStr);
            } else if (deadlineStr.contains(" ")) {
                return LocalDateTime.parse(deadlineStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            } else {
                return LocalDate.parse(deadlineStr).atTime(23, 59, 59);
            }
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(deadlineStr, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception ex) {
                log.warn("[DATE PARSE WARN] Không thể parse hạn nộp: {}", deadlineStr);
                return null;
            }
        }
    }

    private synchronized String generateTaskCode() {
        long count = taskRepository.count();
        long codeNum = 101 + count;
        while (taskRepository.existsByTaskCode("TF-" + codeNum)) {
            codeNum++;
        }
        return "TF-" + codeNum;
    }
}
