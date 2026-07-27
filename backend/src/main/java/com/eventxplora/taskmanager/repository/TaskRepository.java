package com.eventxplora.taskmanager.repository;

import com.eventxplora.taskmanager.entity.Task;
import com.eventxplora.taskmanager.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    List<Task> findByAssignedToIdOrderByCreatedAtDesc(Long employeeId);

    long countByAssignedToId(Long employeeId);
    long countByAssignedToIdAndStatus(Long employeeId, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :employeeId AND t.status != 'COMPLETED' ORDER BY t.createdAt DESC")
    List<Task> findActiveTasksByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :employeeId AND t.status = 'COMPLETED' ORDER BY t.createdAt DESC")
    List<Task> findCompletedTasksByEmployeeId(@Param("employeeId") Long employeeId);

    List<Task> findByAssignedToIdAndStatus(Long employeeId, TaskStatus status);

    long countByStatus(TaskStatus status);

    @Query(value = "SELECT EXTRACT(MONTH FROM t.created_at) AS m, COUNT(t.id) FROM tasks t WHERE t.status = 'COMPLETED' AND t.created_at >= :since GROUP BY EXTRACT(MONTH FROM t.created_at) ORDER BY m", nativeQuery = true)
    List<Object[]> countCompletedTasksByMonth(@Param("since") LocalDateTime since);

    @Query(value = "SELECT EXTRACT(DOW FROM t.updated_at) AS d, COUNT(t.id) FROM tasks t WHERE t.status = 'COMPLETED' AND t.updated_at >= :since GROUP BY EXTRACT(DOW FROM t.updated_at) ORDER BY d", nativeQuery = true)
    List<Object[]> countCompletedTasksByDayOfWeek(@Param("since") LocalDateTime since);

    @Query(value = "SELECT t.id, t.title, t.description, t.assigned_to, t.assigned_by, t.status, t.priority, t.due_date, t.created_at, t.updated_at FROM tasks t ORDER BY t.created_at DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findRecentTasks();

    @Query(value = "SELECT COALESCE(COUNT(t.id), 0) FROM tasks t WHERE t.created_at >= :since AND t.created_at < :until", nativeQuery = true)
    long countTasksCreatedBetween(@Param("since") LocalDateTime since, @Param("until") LocalDateTime until);

    @Query(value = "SELECT COALESCE(COUNT(t.id), 0) FROM tasks t WHERE t.status = 'COMPLETED' AND t.created_at >= :since AND t.created_at < :until", nativeQuery = true)
    long countTasksCompletedBetween(@Param("since") LocalDateTime since, @Param("until") LocalDateTime until);

    @Query(value = "SELECT COALESCE(COUNT(t.id), 0) FROM tasks t WHERE t.status = 'PENDING' AND t.created_at >= :since AND t.created_at < :until", nativeQuery = true)
    long countTasksPendingBetween(@Param("since") LocalDateTime since, @Param("until") LocalDateTime until);

    @Query(value = "SELECT COALESCE(COUNT(t.id), 0) FROM tasks t WHERE t.status = 'IN_PROGRESS' AND t.created_at >= :since AND t.created_at < :until", nativeQuery = true)
    long countTasksInProgressBetween(@Param("since") LocalDateTime since, @Param("until") LocalDateTime until);

    @Query(value = "SELECT COALESCE(COUNT(t.id), 0) FROM tasks t WHERE t.status = 'COMPLETED' AND t.due_date IS NOT NULL AND t.updated_at <= t.due_date", nativeQuery = true)
    long countOnTimeCompletions();

    long count();
}