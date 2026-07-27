package com.eventxplora.taskmanager.repository;

import com.eventxplora.taskmanager.entity.Role;
import com.eventxplora.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Page<User> findByRole(Role role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND (" +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(u.department, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(u.designation, '')) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchEmployees(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.department = :department")
    Page<User> findByDepartment(@Param("department") String department, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.department = :department AND (" +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByDepartmentAndSearch(@Param("department") String department, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.isActive = :isActive")
    Page<User> findByIsActive(@Param("isActive") Boolean isActive, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.department = :department AND u.isActive = :isActive")
    Page<User> findByDepartmentAndIsActive(@Param("department") String department, @Param("isActive") Boolean isActive, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.department = :department AND u.isActive = :isActive AND (" +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByDepartmentAndIsActiveAndSearch(@Param("department") String department, @Param("isActive") Boolean isActive, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.isActive = :isActive AND (" +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByIsActiveAndSearch(@Param("isActive") Boolean isActive, @Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT u.department FROM User u WHERE u.role = 'EMPLOYEE' AND u.department IS NOT NULL")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT u.designation FROM User u WHERE u.role = 'EMPLOYEE' AND u.designation IS NOT NULL")
    List<String> findDistinctDesignations();

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.designation = :designation")
    Page<User> findByDesignation(@Param("designation") String designation, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.designation = :designation AND u.isActive = :isActive")
    Page<User> findByDesignationAndIsActive(@Param("designation") String designation, @Param("isActive") Boolean isActive, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.department = :department AND u.designation = :designation")
    Page<User> findByDepartmentAndDesignation(@Param("department") String department, @Param("designation") String designation, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND u.department = :department AND u.designation = :designation AND u.isActive = :isActive")
    Page<User> findByDepartmentAndDesignationAndIsActive(@Param("department") String department, @Param("designation") String designation, @Param("isActive") Boolean isActive, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' AND (" +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND u.department = :department AND u.designation = :designation AND u.isActive = :isActive")
    Page<User> searchByAll(@Param("search") String search, @Param("department") String department,
                           @Param("designation") String designation, @Param("isActive") Boolean isActive, Pageable pageable);

    long countByRoleAndIsActive(Role role, Boolean isActive);

    @Query(value = "SELECT COALESCE(COUNT(u.id), 0) FROM users u WHERE u.role = 'EMPLOYEE' AND u.created_at >= :since AND u.created_at < :until", nativeQuery = true)
    long countEmployeesCreatedBetween(@Param("since") LocalDateTime since, @Param("until") LocalDateTime until);

    @Query(value = "SELECT EXTRACT(MONTH FROM u.created_at) AS m, COUNT(u.id) FROM users u WHERE u.role = 'EMPLOYEE' AND u.created_at >= :since GROUP BY EXTRACT(MONTH FROM u.created_at) ORDER BY m", nativeQuery = true)
    List<Object[]> countEmployeesByMonth(@Param("since") LocalDateTime since);

    @Query(value = "SELECT u.id, u.full_name, u.email, u.department, u.role, u.created_at FROM users u ORDER BY u.created_at DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findRecentUsers();

    @Query("SELECT MAX(u.id) FROM User u")
    Long findMaxId();
}