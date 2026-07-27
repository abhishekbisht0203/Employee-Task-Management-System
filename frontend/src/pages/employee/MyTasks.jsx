import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTasks, updateTaskStatus } from '../../api/employee';
import TaskCard from '../../components/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Filter } from 'lucide-react';

const tabs = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = () => {
    setLoading(true);
    getMyTasks()
      .then((res) => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTaskStatus(id, newStatus);
      fetchTasks();
      showNotif('Task status updated');
    } catch {
      showNotif('Failed to update status', 'error');
    }
  };

  const filtered = activeTab === 'ALL' ? tasks : tasks.filter((t) => t.status === activeTab);

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

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold m-0" style={{ color: '#0F172A' }}>My Tasks</h1>
        <p className="text-sm mt-1 m-0" style={{ color: '#64748B' }}>View and manage your assigned tasks</p>
      </div>

      <div className="flex items-center gap-1.5 mb-5 p-1 rounded-[12px] overflow-x-auto" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' }}>
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-3 py-1.5 rounded-[8px] text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-200 whitespace-nowrap"
            style={{ color: activeTab === tab ? '#4F46E5' : '#64748B' }}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="taskTab"
                className="absolute inset-0 rounded-[8px]"
                style={{ background: 'rgba(79,70,229,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {tab === 'IN_PROGRESS' ? 'In Progress' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </span>
          </motion.button>
        ))}
      </div>

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
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79,70,229,0.06)' }}>
            <ClipboardList className="w-8 h-8" style={{ color: '#4F46E5' }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>No tasks found</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            {activeTab === 'ALL' ? 'You have no assigned tasks yet' : `No ${activeTab.toLowerCase().replace('_', ' ')} tasks`}
          </p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {filtered.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              index={i}
              onClick={() => navigate(`/employee/tasks/${task.id}`)}
              actions={
                task.status !== 'COMPLETED' ? (
                  <select
                    value={task.status}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(task.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-[30px] px-2 text-xs rounded-[8px] outline-none cursor-pointer transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    aria-label="Update status"
                  >
                    {task.status === 'PENDING' && <option value="PENDING">Pending</option>}
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                ) : null
              }
            />
          ))}
        </motion.div>
      )}
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