import api from './axios';

export const getEmployees = (params) => api.get('/admin/employees', { params });
export const getAllEmployeesList = () => api.get('/admin/employees/all');
export const createEmployee = (data) => api.post('/admin/employees', data);
export const updateEmployee = (id, data) => api.put(`/admin/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/admin/employees/${id}`);
export const getEmployee = (id) => api.get(`/admin/employees/${id}`);
export const getEmployeeDetail = (id) => api.get(`/admin/employees/${id}/detail`);
export const getEmployeeTasks = (id) => api.get(`/admin/employees/${id}/tasks`);
export const getEmployeeWorkLogs = (id) => api.get(`/admin/employees/${id}/worklogs`);
export const getEmployeeStats = () => api.get('/admin/dashboard/employee-stats');
export const getDepartments = () => api.get('/admin/employees/departments');
export const getDesignations = () => api.get('/admin/employees/designations');
export const toggleEmployeeStatus = (id) => api.patch(`/admin/employees/${id}/toggle-status`);

export const getTasks = (params) => api.get('/admin/tasks', { params });
export const getTask = (id) => api.get(`/admin/tasks/${id}`);
export const createTask = (data) => api.post('/admin/tasks', data);

export const getTaskWorkLogs = (id) => api.get(`/admin/tasks/${id}/worklogs`);

export const getDashboardStats = () => api.get('/admin/dashboard/stats');