package com.network.kanban.repository;

import com.network.kanban.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    /** Lấy toàn bộ bài nộp, mới nhất trước */
    List<Submission> findAllByOrderBySubmittedAtDesc();

    /** Tìm bài nộp theo id và trạng thái */
    Optional<Submission> findByIdAndStatus(Long id, String status);

    /** Lấy danh sách bài nộp theo task id */
    List<Submission> findAllByTaskId(Long taskId);

    /** Xóa các bài nộp thuộc về task */
    void deleteAllByTaskId(Long taskId);
}
