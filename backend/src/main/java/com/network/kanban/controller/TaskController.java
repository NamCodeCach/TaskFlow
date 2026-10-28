package com.network.kanban.controller;

import com.network.kanban.dto.request.CreateTaskRequest;
import com.network.kanban.dto.response.ApiResponse;
import com.network.kanban.dto.response.TaskResponse;
import com.network.kanban.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "https://47d275fm-3000.asse.devtunnels.ms/", allowCredentials = "true")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * GET /api/tasks
     * Lấy toàn bộ danh sách task (kèm phân công và trạng thái)
     */
    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        try {
            List<TaskResponse> list = taskService.getAllTasks();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách task thành công!", list));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/tasks/my-tasks?userId=...
     * Lấy danh sách nhiệm vụ được phân công cho một thành viên
     */
    @GetMapping("/my-tasks")
    public ResponseEntity<?> getMyTasks(@RequestParam Long userId) {
        try {
            List<TaskResponse> list = taskService.getMyTasks(userId);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhiệm vụ của bạn thành công!", list));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/tasks/{id}
     * Lấy chi tiết một task
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            TaskResponse task = taskService.getTaskById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin task thành công!", task));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/tasks
     * Tạo task mới và phân công cho nhiều người
     */
    @PostMapping
    public ResponseEntity<?> createTask(@Valid @RequestBody CreateTaskRequest req) {
        try {
            TaskResponse task = taskService.createTask(req);
            return ResponseEntity.ok(ApiResponse.success("Tạo nhiệm vụ và gửi thông báo thành công!", task));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * DELETE /api/tasks/{id}
     * Xóa task
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(ApiResponse.success("Đã xóa nhiệm vụ thành công!", id));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PUT /api/tasks/{id}/status
     * Cập nhật trạng thái task (ví dụ: completed, active)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            TaskResponse updated = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái nhiệm vụ thành công!", updated));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }
}
