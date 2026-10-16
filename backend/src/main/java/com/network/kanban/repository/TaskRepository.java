package com.network.kanban.repository;

import com.network.kanban.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /** Lấy tất cả task của một user theo email, sắp xếp mới nhất trước */
    List<Task> findByAssignedToEmailOrderByCreatedAtDesc(String email);

    /** Lấy tất cả task, mới nhất trước */
    List<Task> findAllByOrderByCreatedAtDesc();

    /** Tìm task theo taskCode (VD: TF-108) */
    Optional<Task> findByTaskCode(String taskCode);

    /** Lấy task theo trạng thái */
    List<Task> findByStatus(String status);

    /** Lấy task theo trạng thái của một user */
    List<Task> findByAssignedToEmailAndStatus(String email, String status);
}
