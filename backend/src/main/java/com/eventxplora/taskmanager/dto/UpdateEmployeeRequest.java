package com.eventxplora.taskmanager.dto;

import jakarta.validation.constraints.Size;

public class UpdateEmployeeRequest {

    @Size(max = 100)
    private String fullName;

    @Size(max = 150)
    private String email;

    @Size(max = 100)
    private String department;

    private Boolean isActive;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
