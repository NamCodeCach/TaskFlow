package com.network.kanban.repository;

import com.network.kanban.model.TaskSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {

    /** Bài nộp của một user, mới nhất trước */
    List<TaskSubmission> findBySubmitterEmailOrderBySubmittedAtDesc(String email);

    /** Tất cả bài nộp, mới nhất trước (Admin xem) */
    List<TaskSubmission> findAllByOrderBySubmittedAtDesc();

    /** Lọc theo trạng thái */
    List<TaskSubmission> findByStatus(String status);

    /** Bài nộp theo taskCode */
    List<TaskSubmission> findByTaskCode(String taskCode);
}
