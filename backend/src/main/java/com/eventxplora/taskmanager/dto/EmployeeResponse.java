package com.eventxplora.taskmanager.dto;

import java.time.LocalDateTime;

public class EmployeeResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String department;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public EmployeeResponse(Long id, String fullName, String email, String role, String department, Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.department = department;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
