package com.eventxplora.taskmanager.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UpdateEmployeeRequest {

    @Size(max = 100)
    private String fullName;

    @Size(max = 150)
    private String email;

    @Size(max = 100)
    private String password;

    @Size(max = 100)
    private String department;

    @Size(max = 100)
    private String designation;

    @Size(max = 20)
    private String phone;

    private String address;

    @Size(max = 10)
    private String gender;

    private LocalDate dateOfBirth;

    @Size(max = 30)
    private String employmentType;

    private Long managerId;

    private Boolean isActive;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}