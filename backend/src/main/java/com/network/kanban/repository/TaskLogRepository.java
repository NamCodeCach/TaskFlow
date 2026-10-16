package com.network.kanban.repository;

import com.network.kanban.model.TaskLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskLogRepository extends JpaRepository<TaskLog, Long> {

    /** Lịch sử của một task cụ thể */
    List<TaskLog> findByTaskIdOrderByTimestampDesc(Long taskId);

    /** Lịch sử theo taskCode */
    List<TaskLog> findByTaskCodeOrderByTimestampDesc(String taskCode);
}
