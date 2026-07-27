package com.eventxplora.taskmanager.controller;

import com.eventxplora.taskmanager.dto.CreateWorkLogRequest;
import com.eventxplora.taskmanager.dto.TaskResponse;
import com.eventxplora.taskmanager.dto.UpdateTaskStatusRequest;
import com.eventxplora.taskmanager.dto.WorkLogResponse;
import com.eventxplora.taskmanager.service.TaskService;
import com.eventxplora.taskmanager.service.WorkLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final TaskService taskService;
    private final WorkLogService workLogService;

    public EmployeeController(TaskService taskService, WorkLogService workLogService) {
        this.taskService = taskService;
        this.workLogService = workLogService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {
        Long employeeId = (Long) authentication.getDetails();
        return ResponseEntity.ok(taskService.getEmployeeActiveTasks(employeeId));
    }

    @GetMapping("/tasks/history")
    public ResponseEntity<List<TaskResponse>> getTaskHistory(Authentication authentication) {
        Long employeeId = (Long) authentication.getDetails();
        return ResponseEntity.ok(taskService.getEmployeeTaskHistory(employeeId));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
                                                          @Valid @RequestBody UpdateTaskStatusRequest request,
                                                          Authentication authentication) {
        Long employeeId = (Long) authentication.getDetails();
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request, employeeId));
    }

    @PostMapping("/tasks/{id}/worklogs")
    public ResponseEntity<WorkLogResponse> addWorkLog(@PathVariable Long id,
                                                       @Valid @RequestBody CreateWorkLogRequest request,
                                                       Authentication authentication) {
        Long employeeId = (Long) authentication.getDetails();
        return new ResponseEntity<>(workLogService.createWorkLog(id, employeeId, request), HttpStatus.CREATED);
    }

    @GetMapping("/tasks/{id}/worklogs")
    public ResponseEntity<List<WorkLogResponse>> getTaskWorkLogs(@PathVariable Long id) {
        return ResponseEntity.ok(workLogService.getWorkLogsByTask(id));
    }
}
