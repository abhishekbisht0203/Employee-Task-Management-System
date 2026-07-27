import { motion } from 'framer-motion';

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

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 16, delay: i * 0.05 },
  }),
};

export default function TaskCard({ task, onClick, actions, index = 0 }) {
  const pColor = priorityColors[task.priority] || priorityColors.LOW;
  const sColor = statusColors[task.status] || statusColors.PENDING;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, boxShadow: '0 12px 30px rgba(15,23,42,0.08)' }}
      onClick={onClick}
      className="relative rounded-[14px] p-4 cursor-pointer overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
        marginBottom: 10,
      }}
    >
      <div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
        style={{ background: pColor.dot }}
      />
      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-sm font-semibold m-0 truncate" style={{ color: '#0F172A' }}>
              {task.title}
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: sColor.bg, color: sColor.text }}
            >
              {task.status?.replace('_', ' ')}
            </span>
          </div>
          {task.description && (
            <p className="text-xs m-0 mb-2 line-clamp-2" style={{ color: '#64748B' }}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: pColor.bg, color: pColor.text }}
            >
              {task.priority}
            </span>
            {task.assignedToName && (
              <span className="text-[11px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {task.assignedToName}
              </span>
            )}
            {task.dueDate && (
              <span className="text-[11px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </motion.div>
  );
}