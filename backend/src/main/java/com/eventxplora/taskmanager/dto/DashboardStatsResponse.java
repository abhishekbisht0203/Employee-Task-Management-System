package com.eventxplora.taskmanager.dto;

import java.util.List;

public class DashboardStatsResponse {
    private long totalEmployees;
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private List<Long> employeeGrowth;
    private List<Long> taskCompletion;
    private List<Long> weeklyProductivity;
    private List<ActivityItem> activity;
    private Trends trends;
    private TeamPerformance teamPerformance;
    private List<RecentEmployee> recentEmployees;
    private List<TaskResponse> recentTasks;

    public DashboardStatsResponse() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }
    public long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }
    public List<Long> getEmployeeGrowth() { return employeeGrowth; }
    public void setEmployeeGrowth(List<Long> employeeGrowth) { this.employeeGrowth = employeeGrowth; }
    public List<Long> getTaskCompletion() { return taskCompletion; }
    public void setTaskCompletion(List<Long> taskCompletion) { this.taskCompletion = taskCompletion; }
    public List<Long> getWeeklyProductivity() { return weeklyProductivity; }
    public void setWeeklyProductivity(List<Long> weeklyProductivity) { this.weeklyProductivity = weeklyProductivity; }
    public List<ActivityItem> getActivity() { return activity; }
    public void setActivity(List<ActivityItem> activity) { this.activity = activity; }
    public Trends getTrends() { return trends; }
    public void setTrends(Trends trends) { this.trends = trends; }
    public TeamPerformance getTeamPerformance() { return teamPerformance; }
    public void setTeamPerformance(TeamPerformance teamPerformance) { this.teamPerformance = teamPerformance; }
    public List<RecentEmployee> getRecentEmployees() { return recentEmployees; }
    public void setRecentEmployees(List<RecentEmployee> recentEmployees) { this.recentEmployees = recentEmployees; }
    public List<TaskResponse> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<TaskResponse> recentTasks) { this.recentTasks = recentTasks; }
}