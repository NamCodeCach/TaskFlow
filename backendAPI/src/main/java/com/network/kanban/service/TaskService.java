package com.network.kanban.service;

import com.network.kanban.model.Task;
import com.network.kanban.model.TaskLog;
import com.network.kanban.repository.TaskLogRepository;
import com.network.kanban.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskLogRepository taskLogRepository;

    // F02 - Lấy tất cả tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // F02 - Tạo task mới
    @Transactional
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // F03 - Cập nhật trạng thái (có kiểm tra @Version)
    @Transactional
    public Task updateStatus(Long taskId, String newStatus, Long version) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task không tồn tại: " + taskId));
        task.setStatus(newStatus);
        // JPA sẽ tự kiểm tra version và ném OptimisticLockException nếu lệch
        return taskRepository.save(task);
    }

    // F04 - Gán người thực hiện
    @Transactional
    public Task assignTask(Long taskId, Long assigneeId, String assigneeName, Long version) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task không tồn tại: " + taskId));
        task.setAssigneeId(assigneeId);
        task.setAssigneeName(assigneeName);
        return taskRepository.save(task);
    }

    // F05 - Cập nhật tiến độ và lưu log
    @Transactional
    public Task reportProgress(Long taskId, Integer newProgress, String reportContent,
                               String reporterName, Long version) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task không tồn tại: " + taskId));

        // Lưu log lịch sử
        TaskLog log = TaskLog.builder()
                .taskId(taskId)
                .reporterName(reporterName)
                .oldProgress(task.getProgress())
                .newProgress(newProgress)
                .reportContent(reportContent)
                .build();
        taskLogRepository.save(log);

        // Nếu tiến độ đạt 100% thì tự chuyển sang DONE
        task.setProgress(newProgress);
        if (newProgress >= 100) {
            task.setStatus("DONE");
        }
        return taskRepository.save(task);
    }

    // Lấy log của một task
    public List<TaskLog> getTaskLogs(Long taskId) {
        return taskLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }
}
