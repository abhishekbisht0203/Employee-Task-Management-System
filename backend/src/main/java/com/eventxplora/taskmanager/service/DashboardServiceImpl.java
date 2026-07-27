package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.*;
import com.eventxplora.taskmanager.entity.Role;
import com.eventxplora.taskmanager.entity.Task;
import com.eventxplora.taskmanager.entity.TaskStatus;
import com.eventxplora.taskmanager.entity.User;
import com.eventxplora.taskmanager.entity.WorkLog;
import com.eventxplora.taskmanager.repository.TaskRepository;
import com.eventxplora.taskmanager.repository.UserRepository;
import com.eventxplora.taskmanager.repository.WorkLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final WorkLogRepository workLogRepository;

    public DashboardServiceImpl(UserRepository userRepository, TaskRepository taskRepository, WorkLogRepository workLogRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.workLogRepository = workLogRepository;
    }

    @Override
    public DashboardStatsResponse getStats() {
        DashboardStatsResponse resp = new DashboardStatsResponse();

        long totalEmployees = userRepository.countByRole(Role.EMPLOYEE);
        long totalTasks = taskRepository.count();
        long pendingTasks = taskRepository.countByStatus(TaskStatus.PENDING);
        long inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);

        log.info("Dashboard stats – employees={}, tasks={}, pending={}, inProgress={}, completed={}",
                totalEmployees, totalTasks, pendingTasks, inProgressTasks, completedTasks);

        resp.setTotalEmployees(totalEmployees);
        resp.setTotalTasks(totalTasks);
        resp.setPendingTasks(pendingTasks);
        resp.setInProgressTasks(inProgressTasks);
        resp.setCompletedTasks(completedTasks);

        List<Long> growth = computeEmployeeGrowth();
        log.info("EmployeeGrowth computed: {} entries – {}", growth.size(), growth);
        resp.setEmployeeGrowth(growth);

        List<Long> completion = computeTaskCompletion();
        log.info("TaskCompletion computed: {} entries – {}", completion.size(), completion);
        resp.setTaskCompletion(completion);

        List<Long> weekly = computeWeeklyProductivity();
        log.info("WeeklyProductivity computed: {} entries – {}", weekly.size(), weekly);
        resp.setWeeklyProductivity(weekly);

        List<ActivityItem> activity = buildActivityFeed();
        log.info("ActivityFeed computed: {} items", activity.size());
        resp.setActivity(activity);

        Trends trends = computeTrends();
        log.info("Trends computed: employee={}, task={}, pending={}, inProgress={}, completed={}",
                trends.getEmployeeTrend(), trends.getTaskTrend(), trends.getPendingTrend(),
                trends.getInProgressTrend(), trends.getCompletedTrend());
        resp.setTrends(trends);

        TeamPerformance perf = computeTeamPerformance(totalTasks, completedTasks, totalEmployees);
        log.info("TeamPerformance computed: completionRate={}, onTimeRate={}, attendance={}",
                perf.getCompletionRate(), perf.getOnTimeRate(), perf.getAttendance());
        resp.setTeamPerformance(perf);

        List<RecentEmployee> recentEmps = fetchRecentEmployees();
        log.info("RecentEmployees fetched: {}", recentEmps.size());
        resp.setRecentEmployees(recentEmps);

        List<TaskResponse> recentT = fetchRecentTasks();
        log.info("RecentTasks fetched: {}", recentT.size());
        resp.setRecentTasks(recentT);

        return resp;
    }

    private List<Long> computeEmployeeGrowth() {
        LocalDateTime startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        log.debug("computeEmployeeGrowth: since={}", startOfYear);
        List<Object[]> rows = userRepository.countEmployeesByMonth(startOfYear);
        log.debug("computeEmployeeGrowth: raw rows count={}", rows.size());
        Map<Integer, Long> monthMap = new HashMap<>();
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            log.debug("computeEmployeeGrowth: month={}, count={}", month, count);
            monthMap.put(month, count);
        }
        List<Long> result = new ArrayList<>(12);
        for (int m = 1; m <= 12; m++) {
            result.add(monthMap.getOrDefault(m, 0L));
        }
        return result;
    }

    private List<Long> computeTaskCompletion() {
        LocalDateTime startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        log.debug("computeTaskCompletion: since={}", startOfYear);
        List<Object[]> rows = taskRepository.countCompletedTasksByMonth(startOfYear);
        log.debug("computeTaskCompletion: raw rows count={}", rows.size());
        Map<Integer, Long> monthMap = new HashMap<>();
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            log.debug("computeTaskCompletion: month={}, count={}", month, count);
            monthMap.put(month, count);
        }
        List<Long> result = new ArrayList<>(12);
        for (int m = 1; m <= 12; m++) {
            result.add(monthMap.getOrDefault(m, 0L));
        }
        return result;
    }

    private List<Long> computeWeeklyProductivity() {
        LocalDateTime weekAgo = LocalDate.now().minusDays(6).atStartOfDay();
        log.debug("computeWeeklyProductivity: since={}", weekAgo);
        List<Object[]> rows = taskRepository.countCompletedTasksByDayOfWeek(weekAgo);
        log.debug("computeWeeklyProductivity: raw rows count={}", rows.size());
        Map<Integer, Long> dowMap = new HashMap<>();
        for (Object[] row : rows) {
            int dow = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();
            log.debug("computeWeeklyProductivity: dow={}, count={}", dow, count);
            dowMap.put(dow, count);
        }
        List<Long> result = new ArrayList<>(7);
        for (int d = 1; d <= 7; d++) {
            int pgDow = d == 7 ? 0 : d;
            result.add(dowMap.getOrDefault(pgDow, 0L));
        }
        return result;
    }

    private Trends computeTrends() {
        LocalDate now = LocalDate.now();
        LocalDateTime curMonthStart = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime curMonthEnd = now.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        LocalDateTime prevMonthStart = now.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime prevMonthEnd = now.withDayOfMonth(1).minusDays(1).atTime(LocalTime.MAX);

        log.debug("computeTrends: cur=[{}, {}], prev=[{}, {}]", curMonthStart, curMonthEnd, prevMonthStart, prevMonthEnd);

        long curEmployees = userRepository.countEmployeesCreatedBetween(curMonthStart, curMonthEnd);
        long prevEmployees = userRepository.countEmployeesCreatedBetween(prevMonthStart, prevMonthEnd);
        log.debug("computeTrends employees: cur={}, prev={}", curEmployees, prevEmployees);
        double employeeTrend = calcTrend(curEmployees, prevEmployees);

        long curTasks = taskRepository.countTasksCreatedBetween(curMonthStart, curMonthEnd);
        long prevTasks = taskRepository.countTasksCreatedBetween(prevMonthStart, prevMonthEnd);
        log.debug("computeTrends tasks: cur={}, prev={}", curTasks, prevTasks);
        double taskTrend = calcTrend(curTasks, prevTasks);

        long curPending = taskRepository.countTasksPendingBetween(curMonthStart, curMonthEnd);
        long prevPending = taskRepository.countTasksPendingBetween(prevMonthStart, prevMonthEnd);
        log.debug("computeTrends pending: cur={}, prev={}", curPending, prevPending);
        double pendingTrend = calcTrend(curPending, prevPending);

        long curInProgress = taskRepository.countTasksInProgressBetween(curMonthStart, curMonthEnd);
        long prevInProgress = taskRepository.countTasksInProgressBetween(prevMonthStart, prevMonthEnd);
        log.debug("computeTrends inProgress: cur={}, prev={}", curInProgress, prevInProgress);
        double inProgressTrend = calcTrend(curInProgress, prevInProgress);

        long curCompleted = taskRepository.countTasksCompletedBetween(curMonthStart, curMonthEnd);
        long prevCompleted = taskRepository.countTasksCompletedBetween(prevMonthStart, prevMonthEnd);
        log.debug("computeTrends completed: cur={}, prev={}", curCompleted, prevCompleted);
        double completedTrend = calcTrend(curCompleted, prevCompleted);

        return new Trends(employeeTrend, taskTrend, pendingTrend, inProgressTrend, completedTrend);
    }

    private double calcTrend(long current, long previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return Math.round(((double) (current - previous) / previous) * 100.0);
    }

    private TeamPerformance computeTeamPerformance(long totalTasks, long completedTasks, long totalEmployees) {
        double completionRate = totalTasks > 0 ? Math.round((double) completedTasks / totalTasks * 100.0) : 0.0;
        long onTime = taskRepository.countOnTimeCompletions();
        long total = taskRepository.countByStatus(TaskStatus.COMPLETED);
        double onTimeRate = total > 0 ? Math.round((double) onTime / total * 100.0) : 0.0;
        long activeEmployees = userRepository.findByRoleAndIsActiveTrue(Role.EMPLOYEE).size();
        double attendance = totalEmployees > 0 ? Math.round((double) activeEmployees / totalEmployees * 100.0) : 0.0;

        log.debug("computeTeamPerformance: completionRate={}, onTime={}/{}={}%, active={}/{}=attendance={}%",
                completionRate, onTime, total, onTimeRate, activeEmployees, totalEmployees, attendance);

        return new TeamPerformance(completionRate, onTimeRate, attendance);
    }

    private List<ActivityItem> buildActivityFeed() {
        List<ActivityItem> items = new ArrayList<>();

        List<Object[]> recentTasks = taskRepository.findRecentTasks();
        log.debug("buildActivityFeed: {} recent tasks", recentTasks.size());
        for (Object[] row : recentTasks) {
            Long taskId = ((Number) row[0]).longValue();
            String title = (String) row[1];
            Object createdObj = row[8];
            String timeLabel = formatTimeAgo(createdObj instanceof java.sql.Timestamp
                    ? ((java.sql.Timestamp) createdObj).toLocalDateTime()
                    : (LocalDateTime) createdObj);
            items.add(new ActivityItem(timeLabel, "System", "created task", title, "info"));
        }

        List<Object[]> recentLogs = workLogRepository.findRecentWorkLogs();
        log.debug("buildActivityFeed: {} recent work logs", recentLogs.size());
        for (Object[] row : recentLogs) {
            Long employeeId = ((Number) row[2]).longValue();
            String note = (String) row[3];
            Object loggedObj = row[5];
            String timeLabel = formatTimeAgo(loggedObj instanceof java.sql.Timestamp
                    ? ((java.sql.Timestamp) loggedObj).toLocalDateTime()
                    : (LocalDateTime) loggedObj);
            String employeeName = userRepository.findById(employeeId).map(User::getFullName).orElse("Unknown");
            String action = "logged work";
            String target = note.length() > 50 ? note.substring(0, 50) + "..." : note;
            items.add(new ActivityItem(timeLabel, employeeName, action, target, "success"));
        }

        List<Object[]> recentUsers = userRepository.findRecentUsers();
        log.debug("buildActivityFeed: {} recent users", recentUsers.size());
        for (Object[] row : recentUsers) {
            String name = (String) row[1];
            Object createdObj = row[5];
            String timeLabel = formatTimeAgo(createdObj instanceof java.sql.Timestamp
                    ? ((java.sql.Timestamp) createdObj).toLocalDateTime()
                    : (LocalDateTime) createdObj);
            items.add(new ActivityItem(timeLabel, name, "joined", "the team", "warning"));
        }

        items.sort((a, b) -> {
            int aIdx = parseTimeAgoWeight(a.getTime());
            int bIdx = parseTimeAgoWeight(b.getTime());
            return Integer.compare(aIdx, bIdx);
        });

        List<ActivityItem> capped = items.size() > 10 ? items.subList(0, 10) : items;
        log.debug("buildActivityFeed: returning {} activity items", capped.size());
        return capped;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "recently";
        LocalDateTime now = LocalDateTime.now();
        long seconds = java.time.Duration.between(dateTime, now).getSeconds();
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return (seconds / 60) + " min ago";
        if (seconds < 86400) return (seconds / 3600) + " hours ago";
        if (seconds < 172800) return "Yesterday";
        return (seconds / 86400) + " days ago";
    }

    private int parseTimeAgoWeight(String label) {
        if (label.equals("Just now")) return 0;
        if (label.endsWith("min ago")) return 1;
        if (label.endsWith("hours ago")) return 2;
        if (label.equals("Yesterday")) return 3;
        if (label.endsWith("days ago")) return 4;
        return 5;
    }

    private List<RecentEmployee> fetchRecentEmployees() {
        List<Object[]> rows = userRepository.findRecentUsers();
        List<RecentEmployee> result = new ArrayList<>();
        for (Object[] row : rows) {
            Long id = ((Number) row[0]).longValue();
            String name = (String) row[1];
            String email = (String) row[2];
            String dept = (String) row[3];
            String role = (String) row[4];
            LocalDateTime createdAt = row[5] instanceof java.sql.Timestamp
                    ? ((java.sql.Timestamp) row[5]).toLocalDateTime()
                    : (LocalDateTime) row[5];
            result.add(new RecentEmployee(id, name, email, dept != null ? dept : "", role, createdAt));
        }
        return result;
    }

    private List<TaskResponse> fetchRecentTasks() {
        List<Object[]> rows = taskRepository.findRecentTasks();
        List<TaskResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            TaskResponse r = new TaskResponse();
            r.setId(((Number) row[0]).longValue());
            r.setTitle((String) row[1]);
            r.setDescription((String) row[2]);
            Long assignedToId = ((Number) row[3]).longValue();
            r.setAssignedToId(assignedToId);
            userRepository.findById(assignedToId).ifPresent(u -> {
                r.setAssignedToName(u.getFullName());
                r.setAssignedToEmail(u.getEmail());
            });
            Long assignedById = ((Number) row[4]).longValue();
            r.setAssignedById(assignedById);
            userRepository.findById(assignedById).ifPresent(u -> r.setAssignedByName(u.getFullName()));
            r.setStatus((String) row[5]);
            r.setPriority((String) row[6]);
            r.setDueDate(row[7] != null ? ((java.sql.Date) row[7]).toLocalDate() : null);
            r.setCreatedAt(row[8] instanceof java.sql.Timestamp ? ((java.sql.Timestamp) row[8]).toLocalDateTime() : (LocalDateTime) row[8]);
            r.setUpdatedAt(row[9] instanceof java.sql.Timestamp ? ((java.sql.Timestamp) row[9]).toLocalDateTime() : (LocalDateTime) row[9]);
            result.add(r);
        }
        return result;
    }
}