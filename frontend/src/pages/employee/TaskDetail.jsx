import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, getTaskWorkLogs, addWorkLog, updateTaskStatus } from '../../api/employee';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Clock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const priorityColors = {
  HIGH: { bg: 'rgba(239,68,68,0.08)', text: '#DC2626', dot: '#EF4444' },
  MEDIUM: { bg: 'rgba(245,158,11,0.08)', text: '#D97706', dot: '#F59E0B' },
  LOW: { bg: 'rgba(34,197,94,0.08)', text: '#16A34A', dot: '#22C55E' },
};

const statusColors = {
  PENDING: { bg: 'rgba(245,158,11,0.08)', text: '#D97706' },
  IN_PROGRESS: { bg: 'rgba(59,130,246,0.08)', text: '#2563EB' },
  COMPLETED: { bg: 'rgba(34,197,94,0.08)', text: '#16A34A' },
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getTaskById(id).then((r) => setTask(r.data)),
      getTaskWorkLogs(id).then((r) => setLogs(r.data)),
    ])
      .catch(() => setError('Failed to load task details'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddLog = async () => {
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await addWorkLog(id, note.trim());
      setNote('');
      const res = await getTaskWorkLogs(id);
      setLogs(res.data);
      showNotif('Work note added');
    } catch {
      showNotif('Failed to add note', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus(id, newStatus);
      const res = await getTaskById(id);
      setTask(res.data);
      showNotif('Status updated');
    } catch {
      showNotif('Failed to update status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="skeleton w-20 h-4" />
        </div>
        <div className="rounded-[16px] p-5 mb-4" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.8)' }}>
          <div className="skeleton w-3/4 h-6 mb-3" />
          <div className="skeleton w-full h-4 mb-2" />
          <div className="skeleton w-1/2 h-4 mb-4" />
          <div className="flex gap-2">
            <div className="skeleton w-16 h-6 rounded-full" />
            <div className="skeleton w-20 h-6 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-2 p-3 rounded-[10px] mb-4" style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}>
          <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm">{error}</span>
        </div>
        <motion.button
          onClick={() => navigate('/employee/tasks')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium bg-transparent border-none cursor-pointer"
          style={{ color: '#4F46E5' }}
          whileHover={{ background: 'rgba(79,70,229,0.06)' }}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to tasks
        </motion.button>
      </div>
    );
  }

  if (!task) return null;

  const pColor = priorityColors[task.priority] || priorityColors.LOW;
  const sColor = statusColors[task.status] || statusColors.PENDING;

  return (
    <div className="p-4 lg:p-6">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
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

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/employee/tasks')}
        className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-[8px] text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-200"
        style={{ color: '#4F46E5' }}
        whileHover={{ background: 'rgba(79,70,229,0.06)' }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Back to tasks
      </motion.button>

      <div
        className="rounded-[16px] p-5 mb-4"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold m-0 mb-2" style={{ color: '#0F172A' }}>{task.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: sColor.bg, color: sColor.text }}>
                {task.status?.replace('_', ' ')}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: pColor.bg, color: pColor.text }}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-[11px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
                  <Clock className="w-3 h-3" strokeWidth={1.5} />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {task.status !== 'COMPLETED' && (
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-[34px] px-3 text-xs rounded-[8px] outline-none cursor-pointer self-start"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
              aria-label="Update status"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          )}
        </div>

        <p className="text-sm mb-4" style={{ color: '#475569' }}>{task.description || 'No description provided.'}</p>

        {task.assignedToName && (
          <div className="flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
            <User className="w-3.5 h-3.5" strokeWidth={1.5} />
            Assigned to: <span className="font-medium" style={{ color: '#475569' }}>{task.assignedToName}</span>
          </div>
        )}
      </div>

      <div
        className="rounded-[16px] p-5 mb-4"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
        }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Add Work Note</h3>
        <div className="flex gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe your progress..."
            className="flex-1 h-[42px] px-3 py-2.5 text-sm rounded-[10px] outline-none resize-none transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddLog(); } }}
          />
          <motion.button
            onClick={handleAddLog}
            disabled={submitting || !note.trim()}
            className="h-[42px] w-[42px] rounded-[10px] flex items-center justify-center cursor-pointer border-none transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}
            whileHover={{ boxShadow: '0 4px 12px rgba(79,70,229,0.25)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Submit work note"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" strokeWidth={2} />
            ) : (
              <Send className="w-4 h-4 text-white" strokeWidth={2} />
            )}
          </motion.button>
        </div>
      </div>

      <div
        className="rounded-[16px] p-5"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
        }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Work Logs {logs.length > 0 && <span className="font-normal" style={{ color: '#94A3B8' }}>({logs.length})</span>}
        </h3>

        {logs.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#94A3B8' }}>No work logs yet. Add your first note above.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: '#E2E8F0' }} />
            <div className="space-y-4">
              {logs.map((log, i) => (
                <motion.div
                  key={log.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex items-start gap-3 pl-6"
                >
                  <div className="absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: '#6366F1' }}>
                    <div className="w-[6px] h-[6px] rounded-full" style={{ background: '#6366F1' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm m-0" style={{ color: '#475569' }}>{log.note}</p>
                    {log.employeeName && (
                      <span className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#94A3B8' }}>
                        <User className="w-3 h-3" strokeWidth={1.5} />
                        {log.employeeName}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}