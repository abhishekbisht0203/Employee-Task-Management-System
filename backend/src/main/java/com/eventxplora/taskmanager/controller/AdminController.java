package com.eventxplora.taskmanager.controller;

import com.eventxplora.taskmanager.dto.*;
import com.eventxplora.taskmanager.entity.TaskStatus;
import com.eventxplora.taskmanager.service.EmployeeService;
import com.eventxplora.taskmanager.service.TaskService;
import com.eventxplora.taskmanager.service.WorkLogService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate joinFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate joinTo,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(employeeService.getEmployees(search, department, designation, isActive, joinFrom, joinTo, sort, page, size));
    }

    @GetMapping("/employees/all")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployeesList() {
        return ResponseEntity.ok(employeeService.getEmployees(null, null, null, null, null, null, null, 0, Integer.MAX_VALUE).getContent());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeResponse> getEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/employees/{id}/detail")
    public ResponseEntity<EmployeeDetailResponse> getEmployeeDetail(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeDetail(id));
    }

    @GetMapping("/employees/{id}/tasks")
    public ResponseEntity<List<TaskResponse>> getEmployeeTasks(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeTasks(id));
    }

    @GetMapping("/employees/{id}/worklogs")
    public ResponseEntity<List<WorkLogResponse>> getEmployeeWorkLogs(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeWorkLogs(id));
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

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/employee-stats")
    public ResponseEntity<EmployeeStatsResponse> getEmployeeStats() {
        return ResponseEntity.ok(employeeService.getEmployeeStats());
    }

    @GetMapping("/employees/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(employeeService.getAllDepartments());
    }

    @GetMapping("/employees/designations")
    public ResponseEntity<List<String>> getDesignations() {
        return ResponseEntity.ok(employeeService.getAllDesignations());
    }

    @PatchMapping("/employees/{id}/toggle-status")
    public ResponseEntity<EmployeeResponse> toggleEmployeeStatus(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.toggleEmployeeStatus(id));
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