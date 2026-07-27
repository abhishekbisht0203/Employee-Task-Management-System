package com.eventxplora.taskmanager.dto;

import java.time.LocalDateTime;

public class WorkLogResponse {
    private Long id;
    private Long taskId;
    private Long employeeId;
    private String employeeName;
    private String note;
    private String statusAtLog;
    private LocalDateTime loggedAt;

    public WorkLogResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getStatusAtLog() { return statusAtLog; }
    public void setStatusAtLog(String statusAtLog) { this.statusAtLog = statusAtLog; }
    public LocalDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; }
}
