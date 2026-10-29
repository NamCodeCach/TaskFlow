package com.network.kanban.repository;

import com.network.kanban.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    /** Lấy tất cả bài nộp do một thành viên nộp */
    List<Submission> findAllBySubmittedById(Long userId);

    /** Gỡ liên kết người duyệt nếu admin bị xóa */
    @Modifying
    @Query("UPDATE Submission s SET s.reviewedBy = null WHERE s.reviewedBy.id = :userId")
    void clearReviewedByForUser(@Param("userId") Long userId);
}
