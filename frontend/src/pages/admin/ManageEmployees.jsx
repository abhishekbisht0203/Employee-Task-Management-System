import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee } from '../../api/admin';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  X,
  Mail,
  User,
  Shield,
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Hash,
} from 'lucide-react';

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.04 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 16 } },
};

function EmployeeModal({ open, onClose, onSave, employee }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', department: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setForm({ fullName: employee.fullName || '', email: employee.email || '', password: '', department: employee.department || '', isActive: employee.isActive !== false });
    } else {
      setForm({ fullName: '', email: '', password: '', department: '', isActive: true });
    }
  }, [employee, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) return;
    if (!isEdit && !form.password.trim()) return;
    setSaving(true);
    try {
      const data = { ...form };
      if (isEdit && !data.password) delete data.password;
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
              className="w-full max-w-[440px] rounded-[20px] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 30px 80px rgba(15,23,42,0.15)',
              }}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <h2 className="text-base font-semibold m-0" style={{ color: '#0F172A' }}>
                  {isEdit ? 'Edit Employee' : 'Add Employee'}
                </h2>
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
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full h-[42px] pl-9 pr-3 text-sm rounded-[10px] outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-[42px] pl-9 pr-3 text-sm rounded-[10px] outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>
                    Password {isEdit && <span className="font-normal" style={{ color: '#94A3B8' }}>(leave blank to keep current)</span>}
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full h-[42px] pl-9 pr-10 text-sm rounded-[10px] outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                      placeholder={isEdit ? '••••••••' : 'Min 6 characters'}
                      required={!isEdit}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                      style={{ color: '#94A3B8' }}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Department</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full h-[42px] pl-9 pr-3 text-sm rounded-[10px] outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                      placeholder="Engineering"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-all duration-200"
                    style={{
                      background: form.isActive ? '#4F46E5' : '#E2E8F0',
                      border: form.isActive ? '1px solid transparent' : '1px solid #CBD5E1',
                    }}
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  >
                    {form.isActive && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#475569' }}>Active Employee</span>
                </label>
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
                    ) : (
                      isEdit ? 'Update Employee' : 'Add Employee'
                    )}
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

function StatusBadge({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
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

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchEmployees = () => {
    setLoading(true);
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openCreate = () => { setSelected(null); setModalOpen(true); };
  const openEdit = (emp) => { setSelected(emp); setModalOpen(true); };
  const handleSave = () => { fetchEmployees(); showNotif(selected ? 'Employee updated' : 'Employee created'); };

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
              background: notification.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${notification.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              color: notification.type === 'success' ? '#16A34A' : '#DC2626',
              backdropFilter: 'blur(12px)',
            }}
          >
            {notification.type === 'success'
              ? <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              : <AlertCircle className="w-4 h-4" strokeWidth={2} />
            }
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
          <span className="hidden xs:inline sm:inline">Add Employee</span>
          <span className="inline xs:hidden sm:hidden">Add</span>
        </motion.button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[10px] mb-4" style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}>
          <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => (
            <div key={i} className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.8)' }}>
              <div className="flex items-center gap-4">
                <div className="skeleton w-[36px] h-[36px] rounded-full" />
                <div className="flex-1">
                  <div className="skeleton w-32 h-4 mb-2" />
                  <div className="skeleton w-48 h-3" />
                </div>
                <div className="skeleton w-16 h-6 rounded-full" />
                <div className="skeleton w-8 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79,70,229,0.06)' }}>
            <Users className="w-8 h-8" style={{ color: '#4F46E5' }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>No employees yet</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Get started by adding your first team member</p>
        </div>
      ) : (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {employees.map((emp) => (
            <motion.div
              key={emp.id}
              variants={rowVariants}
              whileHover={{ y: -1, boxShadow: '0 8px 20px rgba(15,23,42,0.06)' }}
              className="flex items-center gap-3 rounded-[14px] p-3.5 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
              }}
            >
              <div
                className="w-[38px] h-[38px] rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              >
                {emp.fullName?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold m-0 truncate" style={{ color: '#0F172A' }}>{emp.fullName}</p>
                <p className="text-xs m-0 truncate" style={{ color: '#64748B' }}>{emp.email}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
                <Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{emp.department || 'N/A'}</span>
              </div>
              <StatusBadge active={emp.isActive} />
              <motion.button
                onClick={() => openEdit(emp)}
                className="p-2 rounded-[8px] bg-transparent border-none cursor-pointer"
                style={{ color: '#94A3B8' }}
                whileHover={{ background: 'rgba(79,70,229,0.06)', color: '#4F46E5' }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Edit ${emp.fullName}`}
              >
                <Edit3 className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        employee={selected}
      />
    </div>
  );
}

function Users({ className, ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}