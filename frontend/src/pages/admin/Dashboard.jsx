import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../api/admin';
import StatCard from '../../components/StatCard';
import { motion, AnimatePresence } from 'framer-motion';

function SkeletonCard() {
  return (
    <div className="rounded-[16px] p-5 flex-1 min-w-[180px]" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.8)' }}>
      <div className="skeleton w-[42px] h-[42px] rounded-[12px] mb-3" />
      <div className="skeleton w-20 h-3 mb-2" />
      <div className="skeleton w-16 h-8 mb-1" />
      <div className="skeleton w-24 h-3" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-[16px] p-5 flex-1" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.8)' }}>
      <div className="skeleton w-32 h-4 mb-4" />
      <div className="skeleton w-full h-[200px] rounded-[10px]" />
    </div>
  );
}

function MiniLineChart({ data = [], color = '#4F46E5', height = 40 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const width = 100;
  const points = data.length === 1
    ? `0,${height} ${width},${height}`
    : data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');
  return (
    <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0,${height} L${points} L${width},${height} Z`} fill={`url(#lg-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function ClockDisplay() {
  const [time, setTime] = useState(getCurrentTime());
  useEffect(() => {
    const t = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(t);
  }, []);
  return <>{time}</>;
}

function ActivityTimeline({ activities = [] }) {
  if (!activities.length) {
    return <p className="text-sm text-center py-6" style={{ color: '#94A3B8' }}>No activity yet</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: '#E2E8F0' }} />
      <div className="space-y-4">
        {activities.slice(0, 6).map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex items-start gap-3 pl-6"
          >
            <motion.div
              className="absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center"
              style={{
                background: 'white',
                borderColor: a.type === 'success' ? '#22C55E' : a.type === 'warning' ? '#F59E0B' : '#6366F1',
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            >
              <div className="w-[6px] h-[6px] rounded-full"
                style={{ background: a.type === 'success' ? '#22C55E' : a.type === 'warning' ? '#F59E0B' : '#6366F1' }}
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>{a.time}</span>
              </div>
              <p className="text-sm m-0" style={{ color: '#475569' }}>
                <span className="font-medium" style={{ color: '#0F172A' }}>{a.user}</span>
                {' '}{a.action}{' '}
                <span className="font-medium" style={{ color: '#4F46E5' }}>{a.target}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AreaChart({ data = [] }) {
  if (!data.length) return <p className="text-sm text-center py-6" style={{ color: '#94A3B8' }}>No data</p>;
  const max = Math.max(...data, 1);
  const width = 400;
  const height = 180;
  const step = data.length === 1 ? 0 : width / (data.length - 1);
  const points = data.length === 1
    ? `0,${height - (data[0] / max) * height} ${width},${height - (data[0] / max) * height}`
    : data.map((v, i) => `${i * step},${height - (v / max) * height}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[180px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M0,${height} L${points} L${width},${height} Z`}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke="#4F46E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function BarChart({ data = [], color = '#6366F1' }) {
  if (!data.length) return <p className="text-sm text-center py-6" style={{ color: '#94A3B8' }}>No data</p>;
  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end gap-2" style={{ height: 160 }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="rounded-t-[4px] flex-1"
          style={{ background: color + '30' }}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 140 + 10}px` }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
        >
          <motion.div
            className="w-full rounded-t-[4px]"
            style={{ height: '100%', background: `linear-gradient(to top, ${color}, ${color}88)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 + 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function CircularProgress({ value = 0, size = 100, strokeWidth = 6, color = '#4F46E5', label = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#0F172A" fontSize="18" fontWeight="700">
          {value}%
        </text>
      </svg>
      {label && <span className="text-xs mt-1" style={{ color: '#64748B' }}>{label}</span>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label: 'New Employee', icon: '+', path: '/admin/employees', color: '#4F46E5' },
    { label: 'New Task', icon: '+', path: '/admin/tasks', color: '#2563EB' },
    { label: 'Reports', icon: '📊', path: '#', color: '#7C3AED' },
    { label: 'Work Logs', icon: '⏱', path: '/admin/worklogs', color: '#0891B2' },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: '#EF4444' }}>{error}</p>
          <motion.button
            onClick={() => { setLoading(true); setError(''); getDashboardStats().then((res) => setStats(res.data)).catch(() => setError('Failed to load dashboard stats')).finally(() => setLoading(false)); }}
            className="mt-3 px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer border-none"
            style={{ background: 'rgba(79,70,229,0.08)', color: '#4F46E5' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-[20px] p-6 lg:p-8 mb-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.04), rgba(99,102,241,0.02))',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
        }}
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <motion.p
                className="text-sm font-medium mb-1"
                style={{ color: '#4F46E5' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getGreeting()} <span className="inline-block"><ClockDisplay /></span>
              </motion.p>
              <motion.h1
                className="text-2xl lg:text-3xl font-bold m-0 mb-1"
                style={{ color: '#0F172A' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Welcome back, Admin
              </motion.h1>
              <motion.p
                className="text-sm m-0"
                style={{ color: '#64748B' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {getCurrentDate()} &middot; Manage your employees, tasks and work efficiently
              </motion.p>
            </div>
            <motion.div
              className="flex items-center gap-2 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  onClick={() => action.path !== '#' && navigate(action.path)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium cursor-pointer border-none transition-all duration-200"
                  style={{ background: action.color + '0c', color: action.color }}
                  whileHover={{ y: -1, boxShadow: `0 4px 12px ${action.color}18` }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-base">{action.icon}</span>
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <>
          <div className="flex gap-4 flex-wrap mb-6">
            {[1,2,3,4,5].map((i) => <SkeletonCard key={i} />)}
          </div>
          <div className="flex gap-4 flex-wrap mb-6">
            {[1,2,3].map((i) => <SkeletonChart key={i} />)}
          </div>
        </>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <StatCard label="Total Employees" value={stats.totalEmployees || 0} color="indigo" icon="👥" index={0}
              trend={stats.trends?.employeeTrend} trendLabel="vs last month" />
            <StatCard label="Total Tasks" value={stats.totalTasks || 0} color="blue" icon="📋" index={1}
              trend={stats.trends?.taskTrend} trendLabel="vs last month" />
            <StatCard label="Pending" value={stats.pendingTasks || 0} color="orange" icon="⏳" index={2}
              trend={stats.trends?.pendingTrend} trendLabel="vs last month" />
            <StatCard label="In Progress" value={stats.inProgressTasks || 0} color="blue" icon="🔄" index={3}
              trend={stats.trends?.inProgressTrend} trendLabel="vs last month" />
            <StatCard label="Completed" value={stats.completedTasks || 0} color="green" icon="✅" index={4}
              trend={stats.trends?.completedTrend} trendLabel="vs last month" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="rounded-[16px] p-5 lg:col-span-1"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Employee Growth</h3>
              <AreaChart data={stats.employeeGrowth || []} />
              <div className="flex justify-between mt-2 text-[10px]" style={{ color: '#94A3B8' }}>
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
            </div>

            <div className="rounded-[16px] p-5 lg:col-span-1"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Task Completion</h3>
              <BarChart data={stats.taskCompletion || []} />
              <div className="flex justify-between mt-2 text-[10px]" style={{ color: '#94A3B8' }}>
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
            </div>

            <div className="rounded-[16px] p-5 lg:col-span-1"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Weekly Productivity</h3>
              <div className="flex items-end gap-2" style={{ height: 120 }}>
                {(stats.weeklyProductivity?.length ? stats.weeklyProductivity : [0,0,0,0,0,0,0]).map((v, i) => {
                  const max = Math.max(...stats.weeklyProductivity || [1], 1);
                  return (
                    <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full rounded-[6px]"
                        style={{ background: 'linear-gradient(to top, #4F46E5, #6366F1)' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / max) * 100}px` }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                      />
                      <span className="text-[9px]" style={{ color: '#94A3B8' }}>
                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="rounded-[16px] p-5"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold m-0" style={{ color: '#0F172A' }}>Recent Activity</h3>
                <span className="text-xs" style={{ color: '#94A3B8' }}>Today</span>
              </div>
              <ActivityTimeline activities={stats.activity || []} />
            </div>

            <div className="rounded-[16px] p-5"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <h3 className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>Team Performance</h3>
              <div className="flex items-center justify-center gap-8 lg:gap-12">
                <CircularProgress value={stats.teamPerformance?.completionRate || 0} size={110} color="#4F46E5" label="Task Completion" />
                <CircularProgress value={stats.teamPerformance?.onTimeRate || 0} size={110} color="#F59E0B" label="On Time Rate" />
                <CircularProgress value={stats.teamPerformance?.attendance || 0} size={110} color="#22C55E" label="Attendance" />
              </div>
            </div>
          </div>

          {stats.recentEmployees?.length > 0 && (
            <div className="rounded-[16px] p-5 mb-6"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Recent Employees</h3>
              <div className="space-y-2">
                {stats.recentEmployees.slice(0, 4).map((emp) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-2 rounded-[10px]"
                  >
                    <div className="w-[34px] h-[34px] rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {emp.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold m-0 truncate" style={{ color: '#0F172A' }}>{emp.fullName}</p>
                      <p className="text-xs m-0 truncate" style={{ color: '#64748B' }}>{emp.email}</p>
                    </div>
                    <span className="text-[11px]" style={{ color: '#94A3B8' }}>
                      {emp.department || 'N/A'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {stats.recentTasks?.length > 0 && (
            <div className="rounded-[16px] p-5 mb-6"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold m-0" style={{ color: '#0F172A' }}>Recent Tasks</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: '#94A3B8' }}>
                      <th className="text-left font-medium pb-2 pr-3 whitespace-nowrap">Task</th>
                      <th className="text-left font-medium pb-2 pr-3 whitespace-nowrap">Assigned To</th>
                      <th className="text-left font-medium pb-2 pr-3 whitespace-nowrap">Priority</th>
                      <th className="text-left font-medium pb-2 pr-3 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTasks.slice(0, 4).map((task, i) => (
                      <motion.tr
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ borderTop: '1px solid #F1F5F9' }}
                      >
                        <td className="py-2.5 pr-3">
                          <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{task.title}</span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span style={{ color: '#64748B' }}>{task.assignedToName || 'Unassigned'}</span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: task.priority === 'HIGH' ? 'rgba(239,68,68,0.08)' : task.priority === 'MEDIUM' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)',
                              color: task.priority === 'HIGH' ? '#DC2626' : task.priority === 'MEDIUM' ? '#D97706' : '#16A34A',
                            }}
                          >{task.priority}</span>
                        </td>
                        <td className="py-2.5">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: task.status === 'COMPLETED' ? 'rgba(34,197,94,0.08)' : task.status === 'IN_PROGRESS' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                              color: task.status === 'COMPLETED' ? '#16A34A' : task.status === 'IN_PROGRESS' ? '#2563EB' : '#D97706',
                            }}
                          >{task.status?.replace('_', ' ')}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-[16px] p-5"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold m-0" style={{ color: '#0F172A' }}>Mini Stats</h3>
              <div className="flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#4F46E5' }} /> Growth</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#6366F1' }} /> Completion</span>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.div className="flex-1 rounded-[10px] p-3" style={{ background: 'rgba(255,255,255,0.5)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <MiniLineChart data={stats.employeeGrowth?.length ? stats.employeeGrowth : [1]} color="#4F46E5" />
              </motion.div>
              <motion.div className="flex-1 rounded-[10px] p-3" style={{ background: 'rgba(255,255,255,0.5)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <MiniLineChart data={stats.taskCompletion?.length ? stats.taskCompletion : [1]} color="#6366F1" />
              </motion.div>
              <motion.div className="flex-1 rounded-[10px] p-3" style={{ background: 'rgba(255,255,255,0.5)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <MiniLineChart data={stats.weeklyProductivity?.length ? stats.weeklyProductivity : [1]} color="#4F46E5" />
              </motion.div>
              <motion.div className="flex-1 rounded-[10px] p-3" style={{ background: 'rgba(255,255,255,0.5)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <MiniLineChart data={stats.employeeGrowth?.length ? [...stats.employeeGrowth].reverse() : [1]} color="#6366F1" />
              </motion.div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}