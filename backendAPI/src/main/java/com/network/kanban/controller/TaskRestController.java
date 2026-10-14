package com.network.kanban.controller;

import com.network.kanban.model.Task;
import com.network.kanban.model.TaskLog;
import com.network.kanban.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskRestController {

    private final TaskService taskService;

    // F02 - Lấy toàn bộ danh sách task khi load trang
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // F02 - Tạo task mới
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task saved = taskService.createTask(task);
        return ResponseEntity.ok(saved);
    }

    // F05 - Xem lịch sử log của một task
    @GetMapping("/{id}/logs")
    public ResponseEntity<List<TaskLog>> getTaskLogs(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskLogs(id));
    }
}
