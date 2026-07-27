package com.eventxplora.taskmanager.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeResponse {
    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String role;
    private String department;
    private String designation;
    private String phone;
    private String gender;
    private String employmentType;
    private String managerName;
    private Boolean isActive;
    private Integer assignedTasks;
    private Integer completedTasks;
    private Integer pendingTasks;
    private LocalDate dateOfBirth;
    private LocalDate joiningDate;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    public EmployeeResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getAssignedTasks() { return assignedTasks; }
    public void setAssignedTasks(Integer assignedTasks) { this.assignedTasks = assignedTasks; }
    public Integer getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(Integer completedTasks) { this.completedTasks = completedTasks; }
    public Integer getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(Integer pendingTasks) { this.pendingTasks = pendingTasks; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}