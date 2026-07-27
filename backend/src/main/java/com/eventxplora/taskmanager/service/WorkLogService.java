package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.CreateWorkLogRequest;
import com.eventxplora.taskmanager.dto.WorkLogResponse;

import java.util.List;

public interface WorkLogService {
    WorkLogResponse createWorkLog(Long taskId, Long employeeId, CreateWorkLogRequest request);
    List<WorkLogResponse> getWorkLogsByTask(Long taskId);
}
