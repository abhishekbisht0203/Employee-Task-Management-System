package com.eventxplora.taskmanager.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class EmployeeDetailResponse {
    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String gender;
    private LocalDate dateOfBirth;
    private String department;
    private String designation;
    private String managerName;
    private LocalDate joiningDate;
    private String employmentType;
    private String status;
    private LocalDateTime lastLogin;
    private int assignedTasks;
    private int completedTasks;
    private int pendingTasks;
    private double completionPercentage;
    private double avgCompletionDays;
    private List<ActivityItem> recentActivity;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public int getAssignedTasks() { return assignedTasks; }
    public void setAssignedTasks(int assignedTasks) { this.assignedTasks = assignedTasks; }
    public int getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
    public int getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(int pendingTasks) { this.pendingTasks = pendingTasks; }
    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }
    public double getAvgCompletionDays() { return avgCompletionDays; }
    public void setAvgCompletionDays(double avgCompletionDays) { this.avgCompletionDays = avgCompletionDays; }
    public List<ActivityItem> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityItem> recentActivity) { this.recentActivity = recentActivity; }
}