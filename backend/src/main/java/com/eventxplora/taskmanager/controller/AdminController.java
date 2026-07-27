package com.eventxplora.taskmanager.controller;

import com.eventxplora.taskmanager.dto.*;
import com.eventxplora.taskmanager.entity.TaskStatus;
import com.eventxplora.taskmanager.service.EmployeeService;
import com.eventxplora.taskmanager.service.TaskService;
import com.eventxplora.taskmanager.service.WorkLogService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EmployeeService employeeService;
    private final TaskService taskService;
    private final WorkLogService workLogService;

    public AdminController(EmployeeService employeeService, TaskService taskService, WorkLogService workLogService) {
        this.employeeService = employeeService;
        this.taskService = taskService;
        this.workLogService = workLogService;
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @PostMapping("/employees")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        return new ResponseEntity<>(employeeService.createEmployee(request), HttpStatus.CREATED);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request,
                                                    Authentication authentication) {
        Long adminId = (Long) authentication.getDetails();
        return new ResponseEntity<>(taskService.createTask(request, adminId), HttpStatus.CREATED);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(taskService.getAllTasks(status, employeeId, fromDate, toDate));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/tasks/{id}/worklogs")
    public ResponseEntity<List<WorkLogResponse>> getTaskWorkLogs(@PathVariable Long id) {
        return ResponseEntity.ok(workLogService.getWorkLogsByTask(id));
    }
}
