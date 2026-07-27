package com.eventxplora.taskmanager.dto;

public class Trends {
    private double employeeTrend;
    private double taskTrend;
    private double pendingTrend;
    private double inProgressTrend;
    private double completedTrend;

    public Trends() {}

    public Trends(double employeeTrend, double taskTrend, double pendingTrend, double inProgressTrend, double completedTrend) {
        this.employeeTrend = employeeTrend;
        this.taskTrend = taskTrend;
        this.pendingTrend = pendingTrend;
        this.inProgressTrend = inProgressTrend;
        this.completedTrend = completedTrend;
    }

    public double getEmployeeTrend() { return employeeTrend; }
    public void setEmployeeTrend(double employeeTrend) { this.employeeTrend = employeeTrend; }
    public double getTaskTrend() { return taskTrend; }
    public void setTaskTrend(double taskTrend) { this.taskTrend = taskTrend; }
    public double getPendingTrend() { return pendingTrend; }
    public void setPendingTrend(double pendingTrend) { this.pendingTrend = pendingTrend; }
    public double getInProgressTrend() { return inProgressTrend; }
    public void setInProgressTrend(double inProgressTrend) { this.inProgressTrend = inProgressTrend; }
    public double getCompletedTrend() { return completedTrend; }
    public void setCompletedTrend(double completedTrend) { this.completedTrend = completedTrend; }
}