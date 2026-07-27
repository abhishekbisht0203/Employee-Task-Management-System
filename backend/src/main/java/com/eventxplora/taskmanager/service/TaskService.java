package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.CreateTaskRequest;
import com.eventxplora.taskmanager.dto.TaskResponse;
import com.eventxplora.taskmanager.dto.UpdateTaskStatusRequest;
import com.eventxplora.taskmanager.entity.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    TaskResponse createTask(CreateTaskRequest request, Long adminId);
    List<TaskResponse> getAllTasks(TaskStatus status, Long employeeId, LocalDate fromDate, LocalDate toDate);
    List<TaskResponse> getEmployeeActiveTasks(Long employeeId);
    List<TaskResponse> getEmployeeTaskHistory(Long employeeId);
    TaskResponse updateTaskStatus(Long taskId, UpdateTaskStatusRequest request, Long employeeId);
    TaskResponse getTaskById(Long taskId);
}
