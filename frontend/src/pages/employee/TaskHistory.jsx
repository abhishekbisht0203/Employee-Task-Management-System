import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTaskHistory } from '../../api/employee';
import TaskCard from '../../components/TaskCard';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function TaskHistory() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getTaskHistory()
      .then((res) => setTasks(res.data))
      .catch(() => setError('Failed to load task history'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold m-0" style={{ color: '#0F172A' }}>Task History</h1>
        <p className="text-sm mt-1 m-0" style={{ color: '#64748B' }}>View your completed tasks</p>
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
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79,70,229,0.06)' }}>
            <History className="w-8 h-8" style={{ color: '#4F46E5' }} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>No completed tasks yet</p>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Tasks you complete will appear here</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {tasks.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              index={i}
              onClick={() => navigate(`/employee/tasks/${task.id}`)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function History({ className, ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}