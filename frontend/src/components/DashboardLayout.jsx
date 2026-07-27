import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function DashboardLayout({ children, title, subtitle, actions }) {
  const { fullName } = useAuth();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4 lg:p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold m-0" style={{ color: '#0F172A' }}>{title}</h1>
          {subtitle && (
            <p className="text-sm mt-1 m-0" style={{ color: '#64748B' }}>{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>
      {children}
    </motion.div>
  );
}