package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.CreateEmployeeRequest;
import com.eventxplora.taskmanager.dto.EmployeeResponse;
import com.eventxplora.taskmanager.dto.UpdateEmployeeRequest;

import java.util.List;

public interface EmployeeService {
    List<EmployeeResponse> getAllEmployees();
    EmployeeResponse createEmployee(CreateEmployeeRequest request);
    EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request);
}
