package com.network.kanban.controller;

import com.network.kanban.dto.*;
import com.network.kanban.model.Task;
import com.network.kanban.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class TaskSocketController {

    private final TaskService taskService;
    private final SimpMessagingTemplate messagingTemplate;

    // F03 - Cập nhật trạng thái task (kéo thả sang cột khác)
    @MessageMapping("/task.updateStatus")
    public void updateStatus(@Payload TaskStatusUpdateMessage message, Principal principal) {
        String user = principal != null ? principal.getName() : "anonymous";
        log.info("[F03] User '{}' cập nhật task {} -> {}", user, message.getTaskId(), message.getNewStatus());

        try {
            Task updated = taskService.updateStatus(
                    message.getTaskId(), message.getNewStatus(), message.getVersion());

            // Broadcast thành công tới tất cả client
            messagingTemplate.convertAndSend("/topic/kanban",
                    new TaskSocketEvent("STATUS_UPDATED", updated,
                            "Task đã được chuyển sang " + message.getNewStatus()));

        } catch (ObjectOptimisticLockingFailureException e) {
            log.warn("[F06] Xung đột phiên bản - task {} - user '{}'", message.getTaskId(), user);
            sendConflictError(user, message.getTaskId());
        } catch (Exception e) {
            log.error("[ERR] Lỗi khi updateStatus: {}", e.getMessage());
            sendGenericError(user, message.getTaskId(), e.getMessage());
        }
    }

    // F04 - Gán người thực hiện task
    @MessageMapping("/task.assign")
    public void assignTask(@Payload TaskAssignMessage message, Principal principal) {
        String user = principal != null ? principal.getName() : "anonymous";
        log.info("[F04] Gán task {} cho '{}'", message.getTaskId(), message.getAssigneeName());

        try {
            Task updated = taskService.assignTask(
                    message.getTaskId(), message.getAssigneeId(),
                    message.getAssigneeName(), message.getVersion());

            messagingTemplate.convertAndSend("/topic/kanban",
                    new TaskSocketEvent("ASSIGNED", updated,
                            message.getAssigneeName() + " đã nhận task này"));

        } catch (ObjectOptimisticLockingFailureException e) {
            log.warn("[F06] Xung đột phiên bản khi assign - task {}", message.getTaskId());
            sendConflictError(user, message.getTaskId());
        } catch (Exception e) {
            log.error("[ERR] Lỗi khi assign: {}", e.getMessage());
            sendGenericError(user, message.getTaskId(), e.getMessage());
        }
    }

    // F05 - Báo cáo tiến độ
    @MessageMapping("/task.reportProgress")
    public void reportProgress(@Payload TaskProgressMessage message, Principal principal) {
        String user = principal != null ? principal.getName() : "anonymous";
        log.info("[F05] User '{}' báo cáo task {} - {}%", user, message.getTaskId(), message.getProgress());

        try {
            Task updated = taskService.reportProgress(
                    message.getTaskId(), message.getProgress(),
                    message.getReportContent(), message.getReporterName(),
                    message.getVersion());

            messagingTemplate.convertAndSend("/topic/kanban",
                    new TaskSocketEvent("PROGRESS_UPDATED", updated,
                            message.getReporterName() + " cập nhật tiến độ lên " + message.getProgress() + "%"));

        } catch (ObjectOptimisticLockingFailureException e) {
            log.warn("[F06] Xung đột phiên bản khi báo cáo - task {}", message.getTaskId());
            sendConflictError(user, message.getTaskId());
        } catch (Exception e) {
            log.error("[ERR] Lỗi khi reportProgress: {}", e.getMessage());
            sendGenericError(user, message.getTaskId(), e.getMessage());
        }
    }

    // Helper: Gửi lỗi xung đột phiên bản tới riêng user (F06)
    private void sendConflictError(String user, Long taskId) {
        ErrorMessage error = new ErrorMessage(
                "CONFLICT_VERSION",
                "⚠️ Xung đột dữ liệu: Task này vừa được người khác chỉnh sửa! Đang cập nhật lại...",
                taskId);
        messagingTemplate.convertAndSendToUser(user, "/queue/errors", error);
    }

    // Helper: Gửi lỗi chung
    private void sendGenericError(String user, Long taskId, String msg) {
        ErrorMessage error = new ErrorMessage("SERVER_ERROR", "Lỗi server: " + msg, taskId);
        messagingTemplate.convertAndSendToUser(user, "/queue/errors", error);
    }
}
