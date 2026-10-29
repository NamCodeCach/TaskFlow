package com.network.kanban.repository;

import com.network.kanban.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOrderByCreatedAtDesc();

    boolean existsByTaskCode(String taskCode);

    Optional<Task> findTopByOrderByIdDesc();

    /**
     * Lấy danh sách nhiệm vụ được phân công cho một thành viên cụ thể
     */
    @Query("SELECT DISTINCT t FROM Task t JOIN t.assignees a WHERE a.id = :userId ORDER BY t.createdAt DESC")
    List<Task> findAllByAssigneeIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * Gỡ thành viên khỏi bảng phân công nhiệm vụ (task_assignees) trước khi xóa tài khoản
     */
    @Modifying
    @Query(value = "DELETE FROM task_assignees WHERE user_id = :userId", nativeQuery = true)
    void removeUserFromTaskAssignees(@Param("userId") Long userId);

    /**
     * Gỡ liên kết người tạo task nếu user bị xóa
     */
    @Modifying
    @Query("UPDATE Task t SET t.createdBy = null WHERE t.createdBy.id = :userId")
    void clearCreatedByForUser(@Param("userId") Long userId);
}
