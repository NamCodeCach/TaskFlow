package com.network.kanban.controller;

import com.network.kanban.dto.ErrorMessage;
import com.network.kanban.model.Task;
import com.network.kanban.model.TaskLog;
import com.network.kanban.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST API quản lý Task.
 *
 * Các endpoint:
 *   GET    /api/tasks                      – Tất cả task (Admin)
 *   GET    /api/tasks/user?email=...       – Task của user
 *   GET    /api/tasks/{id}                 – Một task theo ID
 *   POST   /api/tasks                     – Tạo task mới (Admin)
 *   PUT    /api/tasks/{id}/status         – Cập nhật trạng thái
 *   DELETE /api/tasks/{id}                – Xóa task (Admin)
 *   GET    /api/tasks/{id}/logs           – Lịch sử hoạt động
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaskRestController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(taskService.getTasksByStatus(status));
        }
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/user")
    public ResponseEntity<List<Task>> getTasksByUser(
            @RequestParam String email,
            @RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(taskService.getTasksByUserAndStatus(email, status));
        }
        return ResponseEntity.ok(taskService.getTasksByUser(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(taskService.getTaskById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            Task saved = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Task saved = taskService.updateTaskStatus(
                    id,
                    body.get("status"),
                    body.get("actorEmail"),
                    body.get("note"));
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa task thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<TaskLog>> getTaskLogs(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskLog(id));
    }
}
