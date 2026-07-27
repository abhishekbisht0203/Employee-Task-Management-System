package com.eventxplora.taskmanager.repository;

import com.eventxplora.taskmanager.dto.WorkLogResponse;
import com.eventxplora.taskmanager.entity.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {
    List<WorkLog> findByTaskIdOrderByLoggedAtDesc(Long taskId);

    @Query("SELECT new com.eventxplora.taskmanager.dto.WorkLogResponse(w.id, w.task.id, w.employee.id, w.employee.fullName, w.note, w.statusAtLog, w.loggedAt) FROM WorkLog w WHERE w.employee.id = :employeeId ORDER BY w.loggedAt DESC")
    List<WorkLogResponse> findByEmployeeIdOrderByLoggedAtDesc(@Param("employeeId") Long employeeId);

    @Query(value = "SELECT wl.id, wl.task_id, wl.employee_id, wl.note, wl.status_at_log, wl.logged_at FROM work_logs wl ORDER BY wl.logged_at DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findRecentWorkLogs();
}