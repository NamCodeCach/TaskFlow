package com.network.kanban.service;

import com.network.kanban.model.Task;
import com.network.kanban.model.TaskLog;
import com.network.kanban.repository.TaskLogRepository;
import com.network.kanban.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskLogRepository taskLogRepository;

    // ─────────────────────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────────────────────

    /** Tất cả task (Admin) */
    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc();
    }

    /** Task của một user */
    public List<Task> getTasksByUser(String email) {
        return taskRepository.findByAssignedToEmailOrderByCreatedAtDesc(
                email.trim().toLowerCase()
        );
    }

    /** Task theo trạng thái */
    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    /** Task của user theo trạng thái */
    public List<Task> getTasksByUserAndStatus(String email, String status) {
        return taskRepository.findByAssignedToEmailAndStatus(email.trim().toLowerCase(), status);
    }

    /** Tìm task theo ID */
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy task ID: " + id));
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE (Admin tạo task)
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public Task createTask(Task task) {
        // Tự sinh taskCode nếu chưa có
        if (task.getTaskCode() == null || task.getTaskCode().isBlank()) {
            long count = taskRepository.count() + 1;
            task.setTaskCode("TF-" + String.format("%03d", count));
        }
        Task saved = taskRepository.save(task);
        logAction(saved.getId(), saved.getTaskCode(), "CREATED",
                saved.getCreatedByEmail(), null, "Task được tạo bởi Admin");
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE STATUS
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public Task updateTaskStatus(Long id, String newStatus, String actorEmail, String note) {
        Task task = getTaskById(id);
        String oldStatus = task.getStatus();
        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);

        logAction(id, saved.getTaskCode(), newStatus, actorEmail, null,
                String.format("Trạng thái: %s → %s. %s", oldStatus, newStatus,
                        note != null ? note : ""));

        log.info("Task {} cập nhật status {} → {}", saved.getTaskCode(), oldStatus, newStatus);
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy task ID: " + id);
        }
        taskRepository.deleteById(id);
        log.info("Đã xóa task ID: {}", id);
    }

    // ─────────────────────────────────────────────────────────────
    // TASK LOG
    // ─────────────────────────────────────────────────────────────

    public List<TaskLog> getTaskLog(Long taskId) {
        return taskLogRepository.findByTaskIdOrderByTimestampDesc(taskId);
    }

    private void logAction(Long taskId, String taskCode, String action,
                           String actorEmail, String actorName, String note) {
        TaskLog log2 = TaskLog.builder()
                .taskId(taskId)
                .taskCode(taskCode)
                .action(action)
                .actorEmail(actorEmail)
                .actorName(actorName)
                .note(note)
                .build();
        taskLogRepository.save(log2);
    }
}
