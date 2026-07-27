package com.eventxplora.taskmanager.repository;

import com.eventxplora.taskmanager.entity.Role;
import com.eventxplora.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleAndIsActiveTrue(Role role);
    List<User> findByRole(Role role);
    long countByRole(Role role);

    @Query(value = "SELECT COALESCE(COUNT(u.id), 0) FROM users u WHERE u.role = 'EMPLOYEE' AND u.created_at >= :since AND u.created_at < :until", nativeQuery = true)
    long countEmployeesCreatedBetween(@Param("since") LocalDateTime since, @Param("until") LocalDateTime until);

    @Query(value = "SELECT EXTRACT(MONTH FROM u.created_at) AS m, COUNT(u.id) FROM users u WHERE u.role = 'EMPLOYEE' AND u.created_at >= :since GROUP BY EXTRACT(MONTH FROM u.created_at) ORDER BY m", nativeQuery = true)
    List<Object[]> countEmployeesByMonth(@Param("since") LocalDateTime since);

    @Query(value = "SELECT u.id, u.full_name, u.email, u.department, u.role, u.created_at FROM users u ORDER BY u.created_at DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findRecentUsers();
}