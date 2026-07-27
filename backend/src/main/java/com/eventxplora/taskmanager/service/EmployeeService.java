package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.*;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeService {
    Page<EmployeeResponse> getEmployees(String search, String department, String designation, Boolean isActive,
                                         LocalDate joinFrom, LocalDate joinTo, String sort, int page, int size);
    EmployeeResponse getEmployeeById(Long id);
    EmployeeDetailResponse getEmployeeDetail(Long id);
    EmployeeStatsResponse getEmployeeStats();
    EmployeeResponse createEmployee(CreateEmployeeRequest request);
    EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request);
    EmployeeResponse toggleEmployeeStatus(Long id);
    void deleteEmployee(Long id);
    List<String> getAllDepartments();
    List<String> getAllDesignations();
    List<TaskResponse> getEmployeeTasks(Long employeeId);
    List<WorkLogResponse> getEmployeeWorkLogs(Long employeeId);
}