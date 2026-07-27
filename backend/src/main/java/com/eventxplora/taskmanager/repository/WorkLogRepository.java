package com.eventxplora.taskmanager.repository;

import com.eventxplora.taskmanager.entity.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {
    List<WorkLog> findByTaskIdOrderByLoggedAtDesc(Long taskId);

    @Query(value = "SELECT wl.id, wl.task_id, wl.employee_id, wl.note, wl.status_at_log, wl.logged_at FROM work_logs wl ORDER BY wl.logged_at DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findRecentWorkLogs();
}