import { useState, useEffect } from 'react';
import { getTasks, getTaskWorkLogs } from '../../api/admin';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, User, FileText, AlertCircle } from 'lucide-react';

function LogTimeline({ logs }) {
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: '#E2E8F0' }} />
      {logs.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: '#94A3B8' }}>No work logs recorded yet</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log, i) => (
            <motion.div
              key={log.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
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
      )}
    </div>
  );
}

export default function AllWorkLogs() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const selectTask = async (task) => {
    setSelectedTask(task);
    setLogsLoading(true);
    try {
      const res = await getTaskWorkLogs(task.id);
      setLogs(res.data);
    } catch (err) {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {!selectedTask ? (
        <>
          <div className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold m-0" style={{ color: '#0F172A' }}>Work Logs</h1>
            <p className="text-sm mt-1 m-0" style={{ color: '#64748B' }}>View work logs recorded by employees</p>
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
                  <div className="skeleton w-3/4 h-4 mb-2" />
                  <div className="skeleton w-1/2 h-3" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(79,70,229,0.06)' }}>
                <Clock className="w-8 h-8" style={{ color: '#4F46E5' }} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>No tasks available</p>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Create tasks first to view work logs</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2, boxShadow: '0 12px 28px rgba(15,23,42,0.08)' }}
                  onClick={() => selectTask(task)}
                  className="rounded-[14px] p-4 cursor-pointer transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-[36px] h-[36px] rounded-[10px] gradient-primary flex items-center justify-center flex-shrink-0">
                      <FileText className="w-[18px] h-[18px] text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold m-0 truncate" style={{ color: '#0F172A' }}>{task.title}</p>
                      <p className="text-xs mt-1 truncate" style={{ color: '#94A3B8' }}>
                        {task.assignedToName || 'Unassigned'}
                      </p>
                      <span
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5"
                        style={{
                          background: task.status === 'COMPLETED' ? 'rgba(34,197,94,0.08)' : task.status === 'IN_PROGRESS' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                          color: task.status === 'COMPLETED' ? '#16A34A' : task.status === 'IN_PROGRESS' ? '#2563EB' : '#D97706',
                        }}
                      >
                        {task.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      ) : (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedTask(null)}
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
            <div className="flex items-start gap-3 mb-4">
              <div className="w-[40px] h-[40px] rounded-[10px] gradient-primary flex items-center justify-center flex-shrink-0">
                <FileText className="w-[20px] h-[20px] text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-semibold m-0" style={{ color: '#0F172A' }}>{selectedTask.title}</h2>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>{selectedTask.description || 'No description'}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    Assigned to: {selectedTask.assignedToName || 'Unassigned'}
                  </span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    Priority: {selectedTask.priority}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
              Work Logs {logs.length > 0 && <span className="font-normal" style={{ color: '#94A3B8' }}>({logs.length})</span>}
            </h3>
            {logsLoading ? (
              <div className="space-y-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex gap-3 pl-6">
                    <div className="skeleton w-[16px] h-[16px] rounded-full" />
                    <div className="flex-1">
                      <div className="skeleton w-24 h-3 mb-1" />
                      <div className="skeleton w-3/4 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <LogTimeline logs={logs} />
            )}
          </div>
        </>
      )}
    </div>
  );
}