package com.eventxplora.taskmanager.dto;

public class EmployeeStatsResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long onLeave;
    private long totalAssignedTasks;

    public EmployeeStatsResponse() {}

    public EmployeeStatsResponse(long totalEmployees, long activeEmployees, long inactiveEmployees, long onLeave, long totalAssignedTasks) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.inactiveEmployees = inactiveEmployees;
        this.onLeave = onLeave;
        this.totalAssignedTasks = totalAssignedTasks;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }
    public long getInactiveEmployees() { return inactiveEmployees; }
    public void setInactiveEmployees(long inactiveEmployees) { this.inactiveEmployees = inactiveEmployees; }
    public long getOnLeave() { return onLeave; }
    public void setOnLeave(long onLeave) { this.onLeave = onLeave; }
    public long getTotalAssignedTasks() { return totalAssignedTasks; }
    public void setTotalAssignedTasks(long totalAssignedTasks) { this.totalAssignedTasks = totalAssignedTasks; }
}