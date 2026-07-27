package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.CreateWorkLogRequest;
import com.eventxplora.taskmanager.dto.WorkLogResponse;
import com.eventxplora.taskmanager.entity.Task;
import com.eventxplora.taskmanager.entity.User;
import com.eventxplora.taskmanager.entity.WorkLog;
import com.eventxplora.taskmanager.exception.ResourceNotFoundException;
import com.eventxplora.taskmanager.repository.TaskRepository;
import com.eventxplora.taskmanager.repository.UserRepository;
import com.eventxplora.taskmanager.repository.WorkLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkLogServiceImpl implements WorkLogService {

    private final WorkLogRepository workLogRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public WorkLogServiceImpl(WorkLogRepository workLogRepository, TaskRepository taskRepository, UserRepository userRepository) {
        this.workLogRepository = workLogRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public WorkLogResponse createWorkLog(Long taskId, Long employeeId, CreateWorkLogRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        WorkLog workLog = new WorkLog();
        workLog.setTask(task);
        workLog.setEmployee(employee);
        workLog.setNote(request.getNote());
        workLog.setStatusAtLog(task.getStatus().name());

        workLog = workLogRepository.save(workLog);
        return toResponse(workLog);
    }

    @Override
    public List<WorkLogResponse> getWorkLogsByTask(Long taskId) {
        return workLogRepository.findByTaskIdOrderByLoggedAtDesc(taskId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private WorkLogResponse toResponse(WorkLog workLog) {
        WorkLogResponse resp = new WorkLogResponse();
        resp.setId(workLog.getId());
        resp.setTaskId(workLog.getTask().getId());
        resp.setEmployeeId(workLog.getEmployee().getId());
        resp.setEmployeeName(workLog.getEmployee().getFullName());
        resp.setNote(workLog.getNote());
        resp.setStatusAtLog(workLog.getStatusAtLog());
        resp.setLoggedAt(workLog.getLoggedAt());
        return resp;
    }
}
