package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.*;
import com.eventxplora.taskmanager.entity.Role;
import com.eventxplora.taskmanager.entity.Task;
import com.eventxplora.taskmanager.entity.TaskStatus;
import com.eventxplora.taskmanager.entity.User;
import com.eventxplora.taskmanager.exception.DuplicateEmailException;
import com.eventxplora.taskmanager.exception.ResourceNotFoundException;
import com.eventxplora.taskmanager.repository.TaskRepository;
import com.eventxplora.taskmanager.repository.UserRepository;
import com.eventxplora.taskmanager.repository.WorkLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final WorkLogRepository workLogRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImpl(UserRepository userRepository, TaskRepository taskRepository,
                               WorkLogRepository workLogRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.workLogRepository = workLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Page<EmployeeResponse> getEmployees(String search, String department, String designation,
                                                Boolean isActive, LocalDate joinFrom, LocalDate joinTo,
                                                String sort, int page, int size) {
        Pageable pageable = buildPageable(page, size, sort);

        Page<User> userPage;

        if (search != null && !search.isBlank()) {
            userPage = queryWithSearch(search, department, designation, isActive, pageable);
        } else if (designation != null && !designation.isBlank()) {
            userPage = queryByDesignation(designation, department, isActive, pageable);
        } else if (department != null && !department.isBlank() && isActive != null) {
            userPage = userRepository.findByDepartmentAndIsActive(department, isActive, pageable);
        } else if (department != null && !department.isBlank()) {
            userPage = userRepository.findByDepartment(department, pageable);
        } else if (isActive != null) {
            userPage = userRepository.findByIsActive(isActive, pageable);
        } else {
            userPage = userRepository.findByRole(Role.EMPLOYEE, pageable);
        }

        log.debug("getEmployees: search={}, dept={}, active={}, page={}, size={} -> {} results",
                search, department, isActive, page, size, userPage.getTotalElements());

        return userPage.map(this::toResponse);
    }

    private Page<User> queryWithSearch(String search, String department, String designation, Boolean isActive, Pageable pageable) {
        if (designation != null && !designation.isBlank() && department != null && !department.isBlank() && isActive != null) {
            return userRepository.searchByAll(search, department, designation, isActive, pageable);
        } else if (department != null && !department.isBlank() && isActive != null) {
            return userRepository.findByDepartmentAndIsActiveAndSearch(department, isActive, search, pageable);
        } else if (department != null && !department.isBlank()) {
            return userRepository.findByDepartmentAndSearch(department, search, pageable);
        } else if (isActive != null) {
            return userRepository.findByIsActiveAndSearch(isActive, search, pageable);
        }
        return userRepository.searchEmployees(search, pageable);
    }

    private Page<User> queryByDesignation(String designation, String department, Boolean isActive, Pageable pageable) {
        if (department != null && !department.isBlank() && isActive != null) {
            return userRepository.findByDepartmentAndDesignationAndIsActive(department, designation, isActive, pageable);
        } else if (department != null && !department.isBlank()) {
            return userRepository.findByDepartmentAndDesignation(department, designation, pageable);
        } else if (isActive != null) {
            return userRepository.findByDesignationAndIsActive(designation, isActive, pageable);
        }
        return userRepository.findByDesignation(designation, pageable);
    }

    private Pageable buildPageable(int page, int size, String sort) {
        if (sort == null || sort.isBlank()) {
            return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        String[] parts = sort.split(",");
        String field = switch (parts[0]) {
            case "name" -> "fullName";
            case "department" -> "department";
            case "status" -> "isActive";
            case "joiningDate", "joinDate" -> "createdAt";
            default -> "createdAt";
        };
        Sort.Direction dir = parts.length > 1 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(dir, field));
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        return toResponse(user);
    }

    @Override
    public EmployeeDetailResponse getEmployeeDetail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        EmployeeDetailResponse resp = new EmployeeDetailResponse();
        resp.setId(user.getId());
        resp.setEmployeeId(user.getEmployeeId());
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setAddress(user.getAddress());
        resp.setGender(user.getGender());
        resp.setDateOfBirth(user.getDateOfBirth());
        resp.setDepartment(user.getDepartment());
        resp.setDesignation(user.getDesignation());
        resp.setManagerName(user.getManager() != null ? user.getManager().getFullName() : null);
        resp.setJoiningDate(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate() : null);
        resp.setEmploymentType(user.getEmploymentType());
        resp.setStatus(user.getIsActive() ? "ACTIVE" : "INACTIVE");
        resp.setLastLogin(user.getLastLogin());

        int assigned = (int) taskRepository.countByAssignedToId(user.getId());
        int completed = (int) taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.COMPLETED);
        int pending = (int) taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.PENDING);

        resp.setAssignedTasks(assigned);
        resp.setCompletedTasks(completed);
        resp.setPendingTasks(pending);
        resp.setCompletionPercentage(assigned > 0 ? Math.round((double) completed / assigned * 100.0) : 0);

        List<Task> completedTasks = taskRepository.findByAssignedToIdAndStatus(user.getId(), TaskStatus.COMPLETED);
        double avgDays = completedTasks.stream()
                .filter(t -> t.getCreatedAt() != null && t.getUpdatedAt() != null)
                .mapToLong(t -> ChronoUnit.DAYS.between(t.getCreatedAt().toLocalDate(),
                        t.getUpdatedAt().toLocalDate()))
                .average().orElse(0);
        resp.setAvgCompletionDays(Math.round(avgDays * 10.0) / 10.0);

        List<ActivityItem> activity = buildEmployeeActivity(user);
        resp.setRecentActivity(activity);

        log.debug("EmployeeDetail: id={}, tasks={} completed={} pending={} avgDays={}",
                id, assigned, completed, pending, avgDays);

        return resp;
    }

    private List<ActivityItem> buildEmployeeActivity(User employee) {
        List<ActivityItem> items = new ArrayList<>();

        List<Task> tasks = taskRepository.findByAssignedToIdOrderByCreatedAtDesc(employee.getId());
        for (Task t : tasks) {
            String label = formatTimeAgo(t.getCreatedAt());
            String action = switch (t.getStatus()) {
                case COMPLETED -> "completed task";
                case IN_PROGRESS -> "started task";
                default -> "was assigned task";
            };
            items.add(new ActivityItem(label, employee.getFullName(), action, t.getTitle(), "info"));
        }

        items.sort((a, b) -> {
            int aIdx = parseTimeAgoWeight(a.getTime());
            int bIdx = parseTimeAgoWeight(b.getTime());
            return Integer.compare(aIdx, bIdx);
        });

        return items.size() > 10 ? items.subList(0, 10) : items;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "recently";
        long seconds = ChronoUnit.SECONDS.between(dateTime, LocalDateTime.now());
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return (seconds / 60) + " min ago";
        if (seconds < 86400) return (seconds / 3600) + " hours ago";
        if (seconds < 172800) return "Yesterday";
        return (seconds / 86400) + " days ago";
    }

    private int parseTimeAgoWeight(String label) {
        if (label.equals("Just now")) return 0;
        if (label.endsWith("min ago")) return 1;
        if (label.endsWith("hours ago")) return 2;
        if (label.equals("Yesterday")) return 3;
        if (label.endsWith("days ago")) return 4;
        return 5;
    }

    @Override
    public EmployeeStatsResponse getEmployeeStats() {
        long total = userRepository.countByRole(Role.EMPLOYEE);
        long active = userRepository.countByRoleAndIsActive(Role.EMPLOYEE, true);
        long inactive = total - active;
        long assignedTasks = taskRepository.count();

        log.debug("EmployeeStats: total={}, active={}, inactive={}, tasks={}", total, active, inactive, assignedTasks);

        return new EmployeeStatsResponse(total, active, inactive, 0L, assignedTasks);
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + request.getEmail());
        }

        User user = new User();
user.setEmployeeId(generateEmployeeId());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.EMPLOYEE);
        user.setDepartment(request.getDepartment());
        user.setDesignation(request.getDesignation());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setEmploymentType(request.getEmploymentType());
        user.setIsActive(true);

        if (request.getManagerId() != null) {
            user.setManager(userRepository.findById(request.getManagerId()).orElse(null));
        }

        user = userRepository.save(user);
        log.info("Created employee: id={}, email={}", user.getId(), user.getEmail());
        return toResponse(user);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) {
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateEmailException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getDesignation() != null) user.setDesignation(request.getDesignation());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getEmploymentType() != null) user.setEmploymentType(request.getEmploymentType());
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());
        if (request.getManagerId() != null) {
            user.setManager(userRepository.findById(request.getManagerId()).orElse(null));
        }

        user = userRepository.save(user);
        log.info("Updated employee: id={}", user.getId());
        return toResponse(user);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        userRepository.delete(user);
        log.info("Deleted employee: id={}", id);
    }

    @Override
    public List<String> getAllDepartments() {
        return userRepository.findDistinctDepartments();
    }

    @Override
    public List<String> getAllDesignations() {
        return userRepository.findDistinctDesignations();
    }

    @Override
    public EmployeeResponse toggleEmployeeStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        user = userRepository.save(user);
        log.info("Toggled employee status: id={}, active={}", id, user.getIsActive());
        return toResponse(user);
    }

    @Override
    public List<TaskResponse> getEmployeeTasks(Long employeeId) {
        return taskRepository.findByAssignedToIdOrderByCreatedAtDesc(employeeId)
                .stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkLogResponse> getEmployeeWorkLogs(Long employeeId) {
        return workLogRepository.findByEmployeeIdOrderByLoggedAtDesc(employeeId);
    }

    private EmployeeResponse toResponse(User user) {
        EmployeeResponse r = new EmployeeResponse();
        r.setId(user.getId());
        r.setEmployeeId(user.getEmployeeId());
        r.setFullName(user.getFullName());
        r.setEmail(user.getEmail());
        r.setRole(user.getRole().name());
        r.setDepartment(user.getDepartment());
        r.setDesignation(user.getDesignation());
        r.setPhone(user.getPhone());
        r.setGender(user.getGender());
        r.setEmploymentType(user.getEmploymentType());
        r.setManagerName(user.getManager() != null ? user.getManager().getFullName() : null);
        r.setIsActive(user.getIsActive());
        r.setDateOfBirth(user.getDateOfBirth());
        r.setJoiningDate(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate() : null);
        r.setLastLogin(user.getLastLogin());
        r.setCreatedAt(user.getCreatedAt());

        r.setAssignedTasks((int) taskRepository.countByAssignedToId(user.getId()));
        r.setCompletedTasks((int) taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.COMPLETED));
        r.setPendingTasks((int) taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.PENDING));

        return r;
    }

    private TaskResponse toTaskResponse(Task task) {
        TaskResponse r = new TaskResponse();
        r.setId(task.getId());
        r.setTitle(task.getTitle());
        r.setDescription(task.getDescription());
        r.setAssignedToId(task.getAssignedTo().getId());
        r.setAssignedToName(task.getAssignedTo().getFullName());
        r.setAssignedToEmail(task.getAssignedTo().getEmail());
        r.setAssignedById(task.getAssignedBy().getId());
        r.setAssignedByName(task.getAssignedBy().getFullName());
        r.setStatus(task.getStatus().name());
        r.setPriority(task.getPriority().name());
        r.setDueDate(task.getDueDate());
        r.setCreatedAt(task.getCreatedAt());
        r.setUpdatedAt(task.getUpdatedAt());
        return r;
    }

    private String generateEmployeeId() {
        Long maxId = userRepository.findMaxId();
        long next = (maxId != null ? maxId : 0) + 1;
        return "EMP" + String.format("%04d", next);
    }
}