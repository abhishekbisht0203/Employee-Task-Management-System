package com.eventxplora.taskmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_logs")
public class WorkLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String note;

    @Column(name = "status_at_log", length = 20)
    private String statusAtLog;

    @Column(name = "logged_at", nullable = false, updatable = false)
    private LocalDateTime loggedAt;

    @PrePersist
    protected void onCreate() {
        this.loggedAt = LocalDateTime.now();
    }

    public WorkLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }
    public User getEmployee() { return employee; }
    public void setEmployee(User employee) { this.employee = employee; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getStatusAtLog() { return statusAtLog; }
    public void setStatusAtLog(String statusAtLog) { this.statusAtLog = statusAtLog; }
    public LocalDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; }
}
