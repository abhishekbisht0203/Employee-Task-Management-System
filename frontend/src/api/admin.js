import api from './axios';

export const getEmployees = () => api.get('/admin/employees');
export const createEmployee = (data) => api.post('/admin/employees', data);
export const updateEmployee = (id, data) => api.put(`/admin/employees/${id}`, data);

export const getTasks = (params) => api.get('/admin/tasks', { params });
export const createTask = (data) => api.post('/admin/tasks', data);

export const getTaskWorkLogs = (id) => api.get(`/admin/tasks/${id}/worklogs`);

export const getDashboardStats = () => api.get('/admin/dashboard/stats');
