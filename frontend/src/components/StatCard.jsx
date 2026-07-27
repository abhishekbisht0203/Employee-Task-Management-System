import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function AnimatedCounter({ value, duration = 1.2, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const steps = 30;
    const stepTime = (duration * 1000) / steps;
    let current = 0;
    const increment = value / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const gradients = {
  blue: 'linear-gradient(135deg, #2563EB, #3B82F6)',
  indigo: 'linear-gradient(135deg, #4F46E5, #6366F1)',
  green: 'linear-gradient(135deg, #16A34A, #22C55E)',
  orange: 'linear-gradient(135deg, #EA580C, #F97316)',
  red: 'linear-gradient(135deg, #DC2626, #EF4444)',
  purple: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 16, delay: i * 0.08 },
  }),
};

export default function StatCard({ label, value, color = 'indigo', icon, trend, trendLabel, index = 0 }) {
  const gradient = gradients[color] || gradients.indigo;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, boxShadow: '0 24px 50px rgba(15,23,42,0.12)' }}
      className="relative rounded-[16px] p-5 flex-1 min-w-[180px] cursor-default"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center text-lg"
          style={{ background: gradient + '15' }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: trend >= 0 ? '#22C55E' : '#EF4444' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {trend >= 0 ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>{label}</p>
      <motion.p
        className="text-[26px] font-bold m-0"
        style={{ color: '#0F172A' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 + index * 0.08 }}
      >
        <AnimatedCounter value={value || 0} />
      </motion.p>
      {trendLabel && (
        <p className="text-[11px] mt-1" style={{ color: '#94A3B8' }}>{trendLabel}</p>
      )}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[16px]"
        style={{ background: gradient, opacity: 0.3, transformOrigin: 'left center' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.5 + index * 0.08 }}
      />
    </motion.div>
  );
}