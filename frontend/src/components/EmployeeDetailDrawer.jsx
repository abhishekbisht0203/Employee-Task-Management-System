import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmployeeDetail, getEmployeeTasks } from '../api/admin';
import {
  X, Mail, Phone, MapPin, Calendar, Briefcase, User, Shield,
  Clock, CheckCircle2, AlertCircle, Loader2, Building2,
} from 'lucide-react';

export default function EmployeeDetailDrawer({ open, onClose, employeeId }) {
  const [detail, setDetail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      Promise.all([
        getEmployeeDetail(employeeId).then(r => r.data),
        getEmployeeTasks(employeeId).then(r => r.data),
      ])
        .then(([d, t]) => { setDetail(d); setTasks(t); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open, employeeId]);

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
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full z-50 w-full max-w-[420px] overflow-y-auto"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '-10px 0 40px rgba(15,23,42,0.1)',
            }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9', background: 'rgba(255,255,255,0.95)' }}>
              <h2 className="text-sm font-semibold m-0" style={{ color: '#0F172A' }}>Employee Details</h2>
              <motion.button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-transparent border-none cursor-pointer"
                style={{ color: '#94A3B8' }}
                whileHover={{ background: '#F1F5F9' }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#4F46E5' }} strokeWidth={2} />
              </div>
            ) : detail ? (
              <div className="p-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-[48px] h-[48px] rounded-full gradient-primary flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {detail.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold m-0 truncate" style={{ color: '#0F172A' }}>{detail.fullName}</p>
                    <p className="text-xs m-0 truncate" style={{ color: '#64748B' }}>{detail.email}</p>
                    {detail.employeeId && <p className="text-[11px] font-mono m-0 mt-0.5" style={{ color: '#4F46E5' }}>{detail.employeeId}</p>}
                  </div>
                  <span
                    className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: detail.status === 'ACTIVE' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
                      color: detail.status === 'ACTIVE' ? '#16A34A' : '#DC2626',
                    }}
                  >
                    {detail.status}
                  </span>
                </div>

                <div className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #F1F5F9' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Personal Info</p>
                  <div className="space-y-2.5">
                    <InfoRow icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Email" value={detail.email} />
                    {detail.phone && <InfoRow icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Phone" value={detail.phone} />}
                    {detail.gender && <InfoRow icon={<User className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Gender" value={detail.gender} />}
                    {detail.dateOfBirth && <InfoRow icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Date of Birth" value={formatDate(detail.dateOfBirth)} />}
                    {detail.address && <InfoRow icon={<MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Address" value={detail.address} />}
                  </div>
                </div>

                <div className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #F1F5F9' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Job Info</p>
                  <div className="space-y-2.5">
                    {detail.department && <InfoRow icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Department" value={detail.department} />}
                    {detail.designation && <InfoRow icon={<Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Designation" value={detail.designation} />}
                    {detail.managerName && <InfoRow icon={<Shield className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Manager" value={detail.managerName} />}
                    {detail.employmentType && <InfoRow icon={<Clock className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Employment Type" value={detail.employmentType} />}
                    {detail.joiningDate && <InfoRow icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Joining Date" value={formatDate(detail.joiningDate)} />}
                    {detail.lastLogin && <InfoRow icon={<Clock className="w-3.5 h-3.5" strokeWidth={1.5} />} label="Last Login" value={formatDateTime(detail.lastLogin)} />}
                  </div>
                </div>

                <div className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #F1F5F9' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Performance</p>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <MiniStat label="Assigned" value={detail.assignedTasks} color="#4F46E5" />
                    <MiniStat label="Completed" value={detail.completedTasks} color="#22C55E" />
                    <MiniStat label="Pending" value={detail.pendingTasks} color="#F59E0B" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#64748B' }}>Completion Rate</span>
                        <span className="font-semibold" style={{ color: detail.completionPercentage >= 50 ? '#16A34A' : '#F59E0B' }}>{detail.completionPercentage}%</span>
                      </div>
                      <div className="h-[6px] rounded-full" style={{ background: '#F1F5F9' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: detail.completionPercentage >= 50 ? 'linear-gradient(90deg, #22C55E, #16A34A)' : 'linear-gradient(90deg, #F59E0B, #D97706)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(detail.completionPercentage, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    {detail.avgCompletionDays > 0 && (
                      <p className="text-xs m-0" style={{ color: '#94A3B8' }}>
                        Avg. {detail.avgCompletionDays} days to complete a task
                      </p>
                    )}
                  </div>
                </div>

                {detail.recentActivity && detail.recentActivity.length > 0 && (
                  <div className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #F1F5F9' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Recent Activity</p>
                    <div className="space-y-3">
                      {detail.recentActivity.map((act, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-[6px] h-[6px] rounded-full mt-1.5 flex-shrink-0" style={{ background: act.type === 'info' ? '#4F46E5' : '#22C55E' }} />
                          <div className="min-w-0">
                            <p className="text-xs m-0" style={{ color: '#0F172A' }}>
                              <span className="font-medium">{act.user}</span> {act.action}
                              {act.target && <span className="font-medium"> {act.target}</span>}
                            </p>
                            <p className="text-[11px] m-0 mt-0.5" style={{ color: '#94A3B8' }}>{act.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tasks.length > 0 && (
                  <div className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #F1F5F9' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Tasks ({tasks.length})</p>
                    <div className="space-y-2">
                      {tasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center gap-2 p-2 rounded-[8px]" style={{ background: 'rgba(255,255,255,0.5)' }}>
                          <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                            task.status === 'COMPLETED' ? 'bg-green-500' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-xs flex-1 min-w-0 truncate" style={{ color: '#0F172A' }}>{task.title}</span>
                          <span className="text-[10px] font-medium flex-shrink-0" style={{ color: '#94A3B8' }}>{task.status?.replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ color: '#94A3B8' }}>{icon}</div>
      <span className="text-xs min-w-[80px]" style={{ color: '#94A3B8' }}>{label}</span>
      <span className="text-xs font-medium truncate" style={{ color: '#0F172A' }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="text-center p-2 rounded-[10px]" style={{ background: `${color}08` }}>
      <p className="text-lg font-bold m-0" style={{ color }}>{value}</p>
      <p className="text-[10px] font-medium m-0" style={{ color: '#64748B' }}>{label}</p>
    </div>
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
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}