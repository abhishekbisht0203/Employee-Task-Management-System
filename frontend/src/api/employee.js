import api from './axios';

export const getMyTasks = () => api.get('/employee/tasks');
export const getTaskById = (id) => api.get(`/employee/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.patch(`/employee/tasks/${id}/status`, { status });
export const addWorkLog = (id, note) => api.post(`/employee/tasks/${id}/worklogs`, { note });
export const getTaskHistory = () => api.get('/employee/tasks/history');
export const getTaskWorkLogs = (id) => api.get(`/employee/tasks/${id}/worklogs`);
