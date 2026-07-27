import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, X, Mail, User, Shield, Briefcase, Eye, EyeOff,
  Loader2, CheckCircle2, AlertCircle, Building2, Search, Trash2,
  RotateCcw, ChevronLeft, ChevronRight, Users, MoreVertical,
  Phone, Calendar, Clock, BookOpen, ListTodo, UserCheck, UserX,
  ChevronDown,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import EmployeeDetailDrawer from '../../components/EmployeeDetailDrawer';
import {
  getEmployees, createEmployee, updateEmployee, deleteEmployee,
  getEmployeeStats, getDepartments, getDesignations, getAllEmployeesList,
  getEmployeeTasks, getEmployeeWorkLogs, toggleEmployeeStatus,
  createTask,
} from '../../api/admin';

const pageSizeOptions = [10, 25, 50];

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 16 } },
};

function EmployeeModal({ open, onClose, onSave, employee, allEmployees }) {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', department: '', designation: '', phone: '',
    address: '', gender: '', employmentType: '', managerId: '', isActive: true, dateOfBirth: '',
  });
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.fullName || '',
        email: employee.email || '',
        password: '',
        department: employee.department || '',
        designation: employee.designation || '',
        phone: employee.phone || '',
        address: employee.address || '',
        gender: employee.gender || '',
        employmentType: employee.employmentType || '',
        managerId: employee.managerId || '',
        isActive: employee.isActive !== false,
        dateOfBirth: employee.dateOfBirth || '',
      });
    } else {
      setForm({ fullName: '', email: '', password: '', department: '', designation: '', phone: '', address: '', gender: '', employmentType: '', managerId: '', isActive: true, dateOfBirth: '' });
    }
  }, [employee, open]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) return;
    if (!isEdit && !form.password.trim()) return;
    setSaving(true);
    try {
      const data = { ...form, managerId: form.managerId ? Number(form.managerId) : null };
      if (!data.password) delete data.password;
      if (isEdit) await updateEmployee(employee.id, data);
      else await createEmployee(data);
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className="w-full max-w-[520px] rounded-[20px] overflow-y-auto max-h-[90vh]"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 30px 80px rgba(15,23,42,0.15)',
              }}
            >
              <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10" style={{ borderBottom: '1px solid #F1F5F9', background: 'rgba(255,255,255,0.95)' }}>
                <h2 className="text-base font-semibold m-0" style={{ color: '#0F172A' }}>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
                <motion.button onClick={onClose} className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer" style={{ color: '#94A3B8' }} whileHover={{ background: '#F1F5F9' }} whileTap={{ scale: 0.9 }}>
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={<User className="w-4 h-4" strokeWidth={1.5} />} label="Full Name *" value={form.fullName} onChange={(v) => set('fullName', v)} placeholder="John Doe" required />
                  <InputField icon={<Mail className="w-4 h-4" strokeWidth={1.5} />} label="Email *" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="john@company.com" required />
                </div>
                <div className="relative">
                  <InputField
                    icon={<Shield className="w-4 h-4" strokeWidth={1.5} />}
                    label={`Password ${isEdit ? '(leave blank to keep)' : ' *'}`}
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(v) => set('password', v)}
                    placeholder={isEdit ? 'Leave blank' : 'Min 6 characters'}
                    required={!isEdit}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-[34px] bg-transparent border-none cursor-pointer" style={{ color: '#94A3B8' }}>
                    {showPwd ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={<Building2 className="w-4 h-4" strokeWidth={1.5} />} label="Department" value={form.department} onChange={(v) => set('department', v)} placeholder="Engineering" />
                  <InputField icon={<Briefcase className="w-4 h-4" strokeWidth={1.5} />} label="Designation" value={form.designation} onChange={(v) => set('designation', v)} placeholder="Senior Developer" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={<User className="w-4 h-4" strokeWidth={1.5} />} label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+1 555-0123" />
                  <SelectField icon={<User className="w-4 h-4" strokeWidth={1.5} />} label="Gender" value={form.gender} onChange={(v) => set('gender', v)} options={['', 'Male', 'Female', 'Other']} />
                </div>
                <InputField icon={<CalendarIcon />} label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(v) => set('dateOfBirth', v)} />
                <InputField icon={<MapPinIcon />} label="Address" value={form.address} onChange={(v) => set('address', v)} placeholder="123 Main St, City" />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField icon={<ClockIcon />} label="Employment Type" value={form.employmentType} onChange={(v) => set('employmentType', v)} options={['', 'Full-time', 'Part-time', 'Contract', 'Intern']} />
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Manager</label>
                    <select
                      value={form.managerId}
                      onChange={(e) => set('managerId', e.target.value)}
                      className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    >
                      <option value="">None</option>
                      {(allEmployees || []).filter((e) => !employee || e.id !== employee.id).map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {isEdit && (
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-all"
                      style={{ background: form.isActive ? '#4F46E5' : '#E2E8F0', border: form.isActive ? '1px solid transparent' : '1px solid #CBD5E1' }}
                      onClick={() => set('isActive', !form.isActive)}
                    >
                      {form.isActive && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm" style={{ color: '#475569' }}>Active Employee</span>
                  </label>
                )}
                <div className="flex gap-3 pt-2">
                  <motion.button type="button" onClick={onClose} className="flex-1 h-[42px] rounded-[10px] text-sm font-medium bg-transparent border-none cursor-pointer" style={{ color: '#64748B', border: '1px solid #E2E8F0' }} whileHover={{ background: '#F8FAFC' }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                  <motion.button type="submit" disabled={saving} className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }} whileHover={{ boxShadow: '0 4px 16px rgba(79,70,229,0.25)' }} whileTap={{ scale: 0.98 }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" strokeWidth={2} /> : (isEdit ? 'Update' : 'Add Employee')}
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

function InputField({ icon, label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[42px] pl-9 pr-3 text-sm rounded-[10px] outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

function SelectField({ icon, label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: '#94A3B8' }}>{icon}</div>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[42px] pl-9 pr-3 text-sm rounded-[10px] outline-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt || `Select ${label}`}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{
        background: active ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
        color: active ? '#16A34A' : '#DC2626',
      }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: active ? '#22C55E' : '#EF4444' }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="w-full max-w-[360px] rounded-[20px] p-6" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 30px 80px rgba(15,23,42,0.15)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#DC2626' }} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-center m-0 mb-1" style={{ color: '#0F172A' }}>{title}</p>
              <p className="text-xs text-center mb-4" style={{ color: '#64748B' }}>{message}</p>
              <div className="flex gap-3">
                <motion.button onClick={onClose} className="flex-1 h-[40px] rounded-[10px] text-sm font-medium bg-transparent border-none cursor-pointer" style={{ color: '#64748B', border: '1px solid #E2E8F0' }} whileHover={{ background: '#F8FAFC' }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                <motion.button onClick={onConfirm} className="flex-1 h-[40px] rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none" style={{ background: '#DC2626' }} whileHover={{ boxShadow: '0 4px 16px rgba(220,38,38,0.25)' }} whileTap={{ scale: 0.98 }}>Confirm</motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AssignTaskModal({ open, onClose, onSave, employee, employees }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await createTask({ ...form, assignedTo: employee.id });
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="w-full max-w-[460px] rounded-[20px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 30px 80px rgba(15,23,42,0.15)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <h2 className="text-base font-semibold m-0" style={{ color: '#0F172A' }}>Assign Task</h2>
                <motion.button onClick={onClose} className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer" style={{ color: '#94A3B8' }} whileHover={{ background: '#F1F5F9' }} whileTap={{ scale: 0.9 }}>
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="flex items-center gap-2.5 p-3 rounded-[10px]" style={{ background: 'rgba(79,70,229,0.06)' }}>
                  <div className="w-[32px] h-[32px] rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {employee?.fullName?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{employee?.fullName}</span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>({employee?.employeeId})</span>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    placeholder="Task title" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full h-[80px] px-3 py-2.5 text-sm rounded-[10px] outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    placeholder="Task description" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Priority</label>
                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}>
                      <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Due Date</label>
                    <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full h-[42px] px-3 text-sm rounded-[10px] outline-none"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button type="button" onClick={onClose} className="flex-1 h-[42px] rounded-[10px] text-sm font-medium bg-transparent border-none cursor-pointer" style={{ color: '#64748B', border: '1px solid #E2E8F0' }} whileHover={{ background: '#F8FAFC' }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                  <motion.button type="submit" disabled={saving} className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }} whileHover={{ boxShadow: '0 4px 16px rgba(79,70,229,0.25)' }} whileTap={{ scale: 0.98 }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" strokeWidth={2} /> : 'Assign Task'}
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

function TasksModal({ open, onClose, employee, tasks }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-[55]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[55] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="w-full max-w-[500px] max-h-[70vh] overflow-y-auto rounded-[20px]" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 30px 80px rgba(15,23,42,0.15)' }}>
              <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{ borderBottom: '1px solid #F1F5F9', background: 'rgba(255,255,255,0.95)' }}>
                <h2 className="text-sm font-semibold m-0" style={{ color: '#0F172A' }}>Tasks assigned to {employee?.fullName}</h2>
                <motion.button onClick={onClose} className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer" style={{ color: '#94A3B8' }} whileHover={{ background: '#F1F5F9' }} whileTap={{ scale: 0.9 }}>
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <div className="p-4 space-y-2">
                {(!tasks || tasks.length === 0) ? (
                  <p className="text-sm text-center py-8" style={{ color: '#94A3B8' }}>No tasks assigned</p>
                ) : tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid #F1F5F9' }}>
                    <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{
                      background: t.status === 'COMPLETED' ? '#22C55E' : t.status === 'IN_PROGRESS' ? '#3B82F6' : '#F59E0B'
                    }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium m-0 truncate" style={{ color: '#0F172A' }}>{t.title}</p>
                      <p className="text-[11px] m-0" style={{ color: '#94A3B8' }}>{t.priority} priority</p>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap" style={{
                      background: t.status === 'COMPLETED' ? 'rgba(34,197,94,0.08)' : t.status === 'IN_PROGRESS' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                      color: t.status === 'COMPLETED' ? '#16A34A' : t.status === 'IN_PROGRESS' ? '#2563EB' : '#D97706',
                    }}>{t.status?.replace(/_/g, ' ')}</span>
                    {t.dueDate && <span className="text-[11px] flex-shrink-0" style={{ color: '#94A3B8' }}>{formatDate(t.dueDate)}</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function WorkLogsModal({ open, onClose, employee, logs }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-[55]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[55] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="w-full max-w-[500px] max-h-[70vh] overflow-y-auto rounded-[20px]" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 30px 80px rgba(15,23,42,0.15)' }}>
              <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{ borderBottom: '1px solid #F1F5F9', background: 'rgba(255,255,255,0.95)' }}>
                <h2 className="text-sm font-semibold m-0" style={{ color: '#0F172A' }}>Work Logs - {employee?.fullName}</h2>
                <motion.button onClick={onClose} className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer" style={{ color: '#94A3B8' }} whileHover={{ background: '#F1F5F9' }} whileTap={{ scale: 0.9 }}>
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <div className="p-4 space-y-2">
                {(!logs || logs.length === 0) ? (
                  <p className="text-sm text-center py-8" style={{ color: '#94A3B8' }}>No work logs found</p>
                ) : logs.map((log) => (
                  <div key={log.id} className="p-3 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid #F1F5F9' }}>
                    <p className="text-xs m-0" style={{ color: '#0F172A' }}>{log.note}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {log.statusAtLog && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,70,229,0.06)', color: '#4F46E5' }}>{log.statusAtLog}</span>}
                      <span className="text-[11px]" style={{ color: '#94A3B8' }}>{formatDateTime(log.loggedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ActionsDropdown({ employee, onViewProfile, onEdit, onAssignTask, onViewTasks, onViewWorkLogs, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleAction = (fn) => {
    setOpen(false);
    fn(employee);
  };

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 190;
    const menuHeight = 300;
    const gap = 4;

    let top = rect.bottom + gap;
    let left = rect.right - menuWidth;

    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < menuHeight && rect.top > menuHeight) {
      top = rect.top - menuHeight - gap;
    }

    if (left < 0) {
      left = rect.left;
    }
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 8;
    }

    setPos({ top, left: Math.max(4, left) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onScroll = () => setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  return (
    <div className="relative" ref={buttonRef}>
      <motion.button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer"
        style={{ color: '#94A3B8' }}
        whileHover={{ background: 'rgba(79,70,229,0.06)', color: '#4F46E5' }}
      >
        <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
      </motion.button>
      {open && createPortal(
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-[190px] rounded-[12px] overflow-hidden z-[9999]"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 12px 40px rgba(15,23,42,0.12)',
            }}
          >
            {[
              { icon: <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'View Profile', action: () => handleAction(onViewProfile) },
              { icon: <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'Edit Employee', action: () => handleAction(onEdit) },
              { icon: <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'Assign Task', action: () => handleAction(onAssignTask) },
              { icon: <ListTodo className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'View Tasks', action: () => handleAction(onViewTasks) },
              { icon: <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'View Work Logs', action: () => handleAction(onViewWorkLogs) },
              { icon: employee.isActive ? <UserX className="w-3.5 h-3.5" strokeWidth={1.5} /> : <UserCheck className="w-3.5 h-3.5" strokeWidth={1.5} />, label: employee.isActive ? 'Deactivate' : 'Activate', action: () => handleAction(onToggleStatus) },
            ].map((item, i) => (
              <motion.button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium bg-transparent border-none cursor-pointer text-left transition-colors"
                style={{ color: '#475569' }}
                whileHover={{ background: 'rgba(79,70,229,0.04)', color: '#4F46E5' }}
              >
                <span style={{ color: '#94A3B8' }}>{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
            <div style={{ borderTop: '1px solid #F1F5F9' }}>
              <motion.button
                onClick={() => handleAction(onDelete)}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium bg-transparent border-none cursor-pointer text-left transition-colors"
                style={{ color: '#DC2626' }}
                whileHover={{ background: 'rgba(239,68,68,0.04)' }}
              >
                <span style={{ color: '#DC2626' }}><Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /></span>
                Delete Employee
              </motion.button>
            </div>
          </motion.div>
        </>,
        document.body
      )}
    </div>
  );
}

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [viewTasksTarget, setViewTasksTarget] = useState(null);
  const [viewTasksData, setViewTasksData] = useState([]);
  const [viewLogsTarget, setViewLogsTarget] = useState(null);
  const [viewLogsData, setViewLogsData] = useState([]);

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [joinFrom, setJoinFrom] = useState('');
  const [joinTo, setJoinTo] = useState('');
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (filterDept) params.department = filterDept;
    if (filterDesignation) params.designation = filterDesignation;
    if (filterStatus) params.isActive = filterStatus === 'active';
    if (joinFrom) params.joinFrom = joinFrom;
    if (joinTo) params.joinTo = joinTo;
    params.sort = sort;
    params.page = page;
    params.size = pageSize;

    Promise.all([
      getEmployees(params).then(r => r.data),
      getEmployeeStats().then(r => r.data),
      getDepartments().then(r => r.data),
      getDesignations().then(r => r.data),
      getAllEmployeesList().then(r => r.data),
    ])
      .then(([pageData, statsData, deptData, desigData, allEmpData]) => {
        setEmployees(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setStats(statsData);
        setDepartments(deptData);
        setDesignations(desigData);
        setAllEmployees(allEmpData);
      })
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, [search, filterDept, filterDesignation, filterStatus, joinFrom, joinTo, sort, page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreate = () => { setSelected(null); setModalOpen(true); };
  const openEdit = (emp) => { setSelected(emp); setModalOpen(true); };

  const handleSave = () => {
    fetchData();
    showNotif(selected ? 'Employee updated successfully' : 'Employee created successfully');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget.id);
      showNotif('Employee deleted successfully');
      setDeleteTarget(null);
      if (employees.length === 1 && page > 0) setPage(page - 1);
      else fetchData();
    } catch {
      showNotif('Failed to delete employee', 'error');
    }
  };

  const handleToggleStatus = async (emp) => {
    try {
      const res = await toggleEmployeeStatus(emp.id);
      showNotif(`Employee ${res.data.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch {
      showNotif('Failed to toggle status', 'error');
    }
  };

  const handleViewTasks = async (emp) => {
    try {
      const res = await getEmployeeTasks(emp.id);
      setViewTasksTarget(emp);
      setViewTasksData(res.data);
    } catch {
      showNotif('Failed to load tasks', 'error');
    }
  };

  const handleViewLogs = async (emp) => {
    try {
      const res = await getEmployeeWorkLogs(emp.id);
      setViewLogsTarget(emp);
      setViewLogsData(res.data);
    } catch {
      showNotif('Failed to load work logs', 'error');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterDept('');
    setFilterDesignation('');
    setFilterStatus('');
    setJoinFrom('');
    setJoinTo('');
    setSort('createdAt,desc');
    setPage(0);
  };

  const hasFilters = search || filterDept || filterDesignation || filterStatus || joinFrom || joinTo;

  const statCards = stats ? [
    { label: 'Total Employees', value: stats.totalEmployees, color: 'indigo', icon: <Users className="w-5 h-5" strokeWidth={1.5} />, trend: stats.totalEmployees > 0 ? 12 : 0 },
    { label: 'Active', value: stats.activeEmployees, color: 'green', icon: <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />, trend: stats.totalEmployees > 0 ? Math.round(stats.activeEmployees / stats.totalEmployees * 100) : 0 },
    { label: 'Inactive', value: stats.inactiveEmployees, color: 'red', icon: <X className="w-5 h-5" strokeWidth={1.5} /> },
    { label: 'On Leave', value: stats.onLeave, color: 'orange', icon: <ClockIcon className="w-5 h-5" strokeWidth={1.5} /> },
    { label: 'Assigned Tasks', value: stats.totalAssignedTasks, color: 'purple', icon: <Briefcase className="w-5 h-5" strokeWidth={1.5} /> },
  ] : [];

  return (
    <div className="p-4 lg:p-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-[12px] shadow-lg sm:max-w-md"
            style={{
              background: notification.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${notification.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              color: notification.type === 'success' ? '#16A34A' : '#DC2626',
              backdropFilter: 'blur(12px)',
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" strokeWidth={2} /> : <AlertCircle className="w-4 h-4" strokeWidth={2} />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold m-0" style={{ color: '#0F172A' }}>Employees</h1>
          <p className="text-sm mt-1 m-0 truncate" style={{ color: '#64748B' }}>Manage your team members</p>
        </div>
        <motion.button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-sm font-semibold text-white cursor-pointer border-none flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
          whileHover={{ y: -1, boxShadow: '0 6px 20px rgba(79,70,229,0.25)' }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden xs:inline">Add Employee</span>
          <span className="inline xs:hidden">Add</span>
        </motion.button>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-3 mb-6">
          {statCards.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value} color={s.color} icon={s.icon} trend={s.trend} index={i} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[160px] max-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search name, email, ID..."
            className="w-full h-[36px] pl-8 pr-3 text-xs rounded-[10px] outline-none"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
          />
        </div>
        <select value={filterDept} onChange={(e) => { setFilterDept(e.target.value); setPage(0); }}
          className="h-[36px] px-2.5 text-xs rounded-[10px] outline-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A', minWidth: 120 }}>
          <option value="">All Depts</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filterDesignation} onChange={(e) => { setFilterDesignation(e.target.value); setPage(0); }}
          className="h-[36px] px-2.5 text-xs rounded-[10px] outline-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A', minWidth: 120 }}>
          <option value="">All Desigs</option>
          {designations.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
          className="h-[36px] px-2.5 text-xs rounded-[10px] outline-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input type="date" value={joinFrom} onChange={(e) => { setJoinFrom(e.target.value); setPage(0); }}
          className="h-[36px] px-2.5 text-xs rounded-[10px] outline-none w-[130px]"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
          placeholder="From" title="Join from" />
        <input type="date" value={joinTo} onChange={(e) => { setJoinTo(e.target.value); setPage(0); }}
          className="h-[36px] px-2.5 text-xs rounded-[10px] outline-none w-[130px]"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
          placeholder="To" title="Join to" />
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }}
          className="h-[36px] px-2.5 text-xs rounded-[10px] outline-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}>
          <option value="createdAt,desc">Newest</option>
          <option value="createdAt,asc">Oldest</option>
          <option value="name,asc">A-Z</option>
          <option value="name,desc">Z-A</option>
          <option value="department,asc">Dept A-Z</option>
          <option value="department,desc">Dept Z-A</option>
        </select>
        {hasFilters && (
          <motion.button onClick={clearFilters}
            className="h-[36px] px-2.5 rounded-[10px] text-xs font-medium cursor-pointer border-none"
            style={{ color: '#64748B', background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0' }}
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[10px] mb-4" style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}>
          <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-1">
          {[1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="rounded-[12px] p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.8)' }}>
              <div className="skeleton w-[32px] h-[32px] rounded-full flex-shrink-0" />
              <div className="skeleton w-16 h-3 flex-shrink-0" />
              <div className="skeleton w-28 h-3 flex-shrink-0" />
              <div className="skeleton w-36 h-3 flex-1" />
              <div className="skeleton w-20 h-3 flex-shrink-0" />
              <div className="skeleton w-16 h-5 rounded-full flex-shrink-0" />
              <div className="skeleton w-24 h-3 flex-shrink-0" />
              <div className="skeleton w-20 h-3 flex-shrink-0" />
              <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79,70,229,0.06)' }}>
            <Users className="w-8 h-8" style={{ color: '#4F46E5' }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>{hasFilters ? 'No employees match your filters' : 'No employees yet'}</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>{hasFilters ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first team member'}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[1100px] space-y-1">
              {employees.map((emp) => (
                <motion.div
                  key={emp.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 transition-all"
                  style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 1px 4px rgba(15,23,42,0.03)' }}
                  whileHover={{ y: -1, boxShadow: '0 6px 16px rgba(15,23,42,0.06)' }}
                >
                  <div className="w-[32px] h-[32px] rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {emp.fullName?.charAt(0) || '?'}
                  </div>
                  <span className="text-[11px] font-mono font-medium w-[68px] flex-shrink-0 truncate" style={{ color: '#4F46E5' }}>{emp.employeeId}</span>
                  <div className="w-[130px] flex-shrink-0 min-w-0">
                    <p className="text-xs font-semibold m-0 truncate" style={{ color: '#0F172A' }}>{emp.fullName}</p>
                  </div>
                  <span className="text-[11px] w-[140px] flex-shrink-0 truncate" style={{ color: '#64748B' }}>{emp.email}</span>
                  <span className="text-[11px] w-[100px] flex-shrink-0 truncate" style={{ color: '#64748B' }}>{emp.phone || '—'}</span>
                  <span className="text-[11px] w-[90px] flex-shrink-0 truncate" style={{ color: '#64748B' }}>{emp.department || '—'}</span>
                  <span className="text-[11px] w-[100px] flex-shrink-0 truncate" style={{ color: '#64748B' }}>{emp.designation || '—'}</span>
                  <span className="text-[11px] w-[80px] flex-shrink-0 truncate" style={{ color: '#64748B' }}>{emp.managerName || '—'}</span>
                  <div className="w-[68px] flex-shrink-0"><StatusBadge active={emp.isActive} /></div>
                  <div className="flex items-center gap-1.5 w-[90px] flex-shrink-0 text-[11px]" style={{ color: '#64748B' }}>
                    <span className="font-medium" style={{ color: '#4F46E5' }}>{emp.assignedTasks ?? 0}</span>
                    <span style={{ color: '#94A3B8' }}>/</span>
                    <span className="font-medium" style={{ color: '#22C55E' }}>{emp.completedTasks ?? 0}</span>
                    <span style={{ color: '#94A3B8' }}>/</span>
                    <span className="font-medium" style={{ color: '#F59E0B' }}>{emp.pendingTasks ?? 0}</span>
                  </div>
                  <span className="text-[11px] w-[75px] flex-shrink-0 truncate" style={{ color: '#94A3B8' }}>{emp.joiningDate ? formatDate(emp.joiningDate) : '—'}</span>
                  <span className="text-[11px] w-[80px] flex-shrink-0 truncate" style={{ color: '#94A3B8' }}>{emp.lastLogin ? formatDateTime(emp.lastLogin) : '—'}</span>
                  <ActionsDropdown
                    employee={emp}
                    onViewProfile={(e) => setDetailId(e.id)}
                    onEdit={openEdit}
                    onAssignTask={setAssignTarget}
                    onViewTasks={handleViewTasks}
                    onViewWorkLogs={handleViewLogs}
                    onToggleStatus={handleToggleStatus}
                    onDelete={setDeleteTarget}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
            <div className="flex items-center gap-2">
              <p className="text-xs m-0" style={{ color: '#94A3B8' }}>
                Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalElements)} of {totalElements}
              </p>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                className="h-[30px] px-2 text-[11px] rounded-[8px] outline-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}>
                {pageSizeOptions.map((s) => <option key={s} value={s}>{s} / page</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.button disabled={page === 0} onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-[8px] bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
                whileHover={page > 0 ? { background: '#F1F5F9' } : {}} whileTap={page > 0 ? { scale: 0.95 } : {}}>
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              </motion.button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) pageNum = i;
                else if (page < 3) pageNum = i;
                else if (page > totalPages - 4) pageNum = totalPages - 7 + i;
                else pageNum = page - 3 + i;
                return (
                  <motion.button key={pageNum} onClick={() => setPage(pageNum)}
                    className="w-[28px] h-[28px] rounded-[7px] text-[11px] font-medium bg-transparent border-none cursor-pointer"
                    style={{
                      background: page === pageNum ? '#4F46E5' : 'transparent',
                      color: page === pageNum ? 'white' : '#64748B',
                      border: page === pageNum ? 'none' : '1px solid #E2E8F0',
                    }}
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                    {pageNum + 1}
                  </motion.button>
                );
              })}
              <motion.button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-[8px] bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
                whileHover={page < totalPages - 1 ? { background: '#F1F5F9' } : {}} whileTap={page < totalPages - 1 ? { scale: 0.95 } : {}}>
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>
        </>
      )}

      <EmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} employee={selected} allEmployees={allEmployees} />
      <EmployeeDetailDrawer open={!!detailId} onClose={() => setDetailId(null)} employeeId={detailId} />
      <AssignTaskModal open={!!assignTarget} onClose={() => setAssignTarget(null)} onSave={() => { fetchData(); showNotif('Task assigned successfully'); }} employee={assignTarget} employees={allEmployees} />
      <TasksModal open={!!viewTasksTarget} onClose={() => setViewTasksTarget(null)} employee={viewTasksTarget} tasks={viewTasksData} />
      <WorkLogsModal open={!!viewLogsTarget} onClose={() => setViewLogsTarget(null)} employee={viewLogsTarget} logs={viewLogsData} />
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Employee?" message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`} />
    </div>
  );
}

function CalendarIcon(props) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}