package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.CreateTaskRequest;
import com.eventxplora.taskmanager.dto.TaskResponse;
import com.eventxplora.taskmanager.dto.UpdateTaskStatusRequest;
import com.eventxplora.taskmanager.entity.*;
import com.eventxplora.taskmanager.exception.ResourceNotFoundException;
import com.eventxplora.taskmanager.exception.UnauthorizedActionException;
import com.eventxplora.taskmanager.repository.TaskRepository;
import com.eventxplora.taskmanager.repository.TaskSpecification;
import com.eventxplora.taskmanager.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TaskResponse createTask(CreateTaskRequest request, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        User employee = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getAssignedTo()));

        if (employee.getRole() != Role.EMPLOYEE) {
            throw new IllegalArgumentException("User is not an employee");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedTo(employee);
        task.setAssignedBy(admin);

        if (request.getPriority() != null) {
            task.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        }
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.PENDING);

        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(TaskStatus status, Long employeeId, LocalDate fromDate, LocalDate toDate) {
        LocalDateTime fromDateTime = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime toDateTime = toDate != null ? toDate.atTime(23, 59, 59) : null;
        return taskRepository.findAll(
                TaskSpecification.withFilters(status, employeeId, fromDateTime, toDateTime),
                Sort.by(Sort.Direction.DESC, "createdAt")
        ).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getEmployeeActiveTasks(Long employeeId) {
        return taskRepository.findActiveTasksByEmployeeId(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getEmployeeTaskHistory(Long employeeId) {
        return taskRepository.findCompletedTasksByEmployeeId(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TaskResponse updateTaskStatus(Long taskId, UpdateTaskStatusRequest request, Long employeeId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (!task.getAssignedTo().getId().equals(employeeId)) {
            throw new UnauthorizedActionException("This task is not assigned to you");
        }

        TaskStatus newStatus = TaskStatus.valueOf(request.getStatus().toUpperCase());
        task.setStatus(newStatus);
        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return toResponse(task);
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse resp = new TaskResponse();
        resp.setId(task.getId());
        resp.setTitle(task.getTitle());
        resp.setDescription(task.getDescription());
        resp.setAssignedToId(task.getAssignedTo().getId());
        resp.setAssignedToName(task.getAssignedTo().getFullName());
        resp.setAssignedToEmail(task.getAssignedTo().getEmail());
        resp.setAssignedById(task.getAssignedBy().getId());
        resp.setAssignedByName(task.getAssignedBy().getFullName());
        resp.setStatus(task.getStatus().name());
        resp.setPriority(task.getPriority() != null ? task.getPriority().name() : null);
        resp.setDueDate(task.getDueDate());
        resp.setCreatedAt(task.getCreatedAt());
        resp.setUpdatedAt(task.getUpdatedAt());
        return resp;
    }
}
