package com.eventxplora.taskmanager.dto;

public class ActivityItem {
    private String time;
    private String user;
    private String action;
    private String target;
    private String type;

    public ActivityItem() {}

    public ActivityItem(String time, String user, String action, String target, String type) {
        this.time = time;
        this.user = user;
        this.action = action;
        this.target = target;
        this.type = type;
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}