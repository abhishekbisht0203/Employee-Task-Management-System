package com.eventxplora.taskmanager.dto;

public class TeamPerformance {
    private double completionRate;
    private double onTimeRate;
    private double attendance;

    public TeamPerformance() {}

    public TeamPerformance(double completionRate, double onTimeRate, double attendance) {
        this.completionRate = completionRate;
        this.onTimeRate = onTimeRate;
        this.attendance = attendance;
    }

    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
    public double getOnTimeRate() { return onTimeRate; }
    public void setOnTimeRate(double onTimeRate) { this.onTimeRate = onTimeRate; }
    public double getAttendance() { return attendance; }
    public void setAttendance(double attendance) { this.attendance = attendance; }
}