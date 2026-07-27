import { useState, useEffect } from 'react';
import { getTasks, createTask, getEmployees } from '../../api/admin';
import TaskCard from '../../components/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react';

function CreateTaskModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'MEDIUM', dueDate: '' });
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      getEmployees().then((res) => setEmployees(res.data)).catch(() => {});
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await createTask({ ...form, assignedTo: form.assignedTo ? Number(form.assignedTo) : null });
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className="w-full max-w-[480px] rounded-[20px] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 30px 80px rgba(15,23,42,0.15)',
              }}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <h2 className="text-base font-semibold m-0" style={{ color: '#0F172A' }}>Create Task</h2>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer"
                  style={{ color: '#94A3B8' }}
                  whileHover={{ background: '#F1F5F9' }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full h-[80px] px-3 py-2.5 text-sm rounded-[10px] outline-none resize-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    placeholder="Task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none transition-all duration-200 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Due Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Assign To</label>
                  <select
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none transition-all duration-200 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                  >
                    <option value="">Unassigned</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-[42px] rounded-[10px] text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-200"
                    style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
                    whileHover={{ background: '#F8FAFC' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
                    whileHover={{ boxShadow: '0 4px 16px rgba(79,70,229,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" strokeWidth={2} />
                    ) : 'Create Task'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({ status: '', employeeId: '', dateFrom: '', dateTo: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [employees, setEmployees] = useState([]);

  const fetchTasks = () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.employeeId) params.employeeId = filters.employeeId;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    getTasks(params)
      .then((res) => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
    getEmployees().then((res) => setEmployees(res.data)).catch(() => {});
  }, []);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const clearFilters = () => {
    setFilters({ status: '', employeeId: '', dateFrom: '', dateTo: '' });
    setLoading(true);
    getTasks().then((res) => setTasks(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  return (
    <div className="p-4 lg:p-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 20 }}
            className="fixed top-20 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-3 rounded-[12px] shadow-lg sm:max-w-md"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#16A34A',
              backdropFilter: 'blur(12px)',
            }}
          >
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold m-0" style={{ color: '#0F172A' }}>Tasks</h1>
          <p className="text-sm mt-1 m-0 truncate" style={{ color: '#64748B' }}>Manage and assign tasks</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-[10px] text-sm font-medium cursor-pointer border-none transition-all duration-200"
            style={{
              color: showFilters ? '#4F46E5' : '#64748B',
              background: showFilters ? 'rgba(79,70,229,0.06)' : 'rgba(255,255,255,0.6)',
              border: '1px solid #E2E8F0',
            }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Filter className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden xs:inline">Filters</span>
          </motion.button>
          <motion.button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
            whileHover={{ y: -1, boxShadow: '0 6px 20px rgba(79,70,229,0.25)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden xs:inline">Create</span>
            <span className="inline xs:hidden">+</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-end gap-3 p-4 rounded-[14px] mb-4"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.8)',
            }}
          >
            <div>
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="h-[36px] px-3 text-xs rounded-[8px] outline-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>Employee</label>
              <select
                value={filters.employeeId}
                onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                className="h-[36px] px-3 text-xs rounded-[8px] outline-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
              >
                <option value="">All</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="h-[36px] px-3 text-xs rounded-[8px] outline-none"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#94A3B8' }}>To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="h-[36px] px-3 text-xs rounded-[8px] outline-none"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={fetchTasks}
                className="h-[36px] px-4 rounded-[8px] text-xs font-semibold text-white cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Apply
              </motion.button>
              <motion.button
                onClick={clearFilters}
                className="h-[36px] px-3 rounded-[8px] text-xs font-medium cursor-pointer border-none"
                style={{ color: '#64748B', background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0' }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[10px] mb-4" style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}>
          <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.8)' }}>
              <div className="skeleton w-3/4 h-4 mb-2" />
              <div className="skeleton w-1/2 h-3 mb-2" />
              <div className="flex gap-2">
                <div className="skeleton w-14 h-5 rounded-full" />
                <div className="skeleton w-20 h-5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79,70,229,0.06)' }}>
            <ClipboardList className="w-8 h-8" style={{ color: '#4F46E5' }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>No tasks found</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Create a task to get started</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {tasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </motion.div>
      )}

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => { fetchTasks(); showNotif('Task created successfully'); }}
      />
    </div>
  );
}

function ClipboardList({ className, ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}