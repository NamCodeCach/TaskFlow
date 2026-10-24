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

    /** Tìm bài nộp theo id và trạng thái (ví dụ chỉ duyệt khi còn "submitted") */
    Optional<Submission> findByIdAndStatus(Long id, String status);
}
