package com.network.kanban.repository;

import com.network.kanban.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOrderByCreatedAtDesc();

    boolean existsByTaskCode(String taskCode);

    Optional<Task> findTopByOrderByIdDesc();
}
