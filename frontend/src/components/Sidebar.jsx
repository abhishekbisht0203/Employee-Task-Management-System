import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const navItems = {
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/employees', label: 'Employees', icon: Users },
    { path: '/admin/tasks', label: 'Tasks', icon: ClipboardList },
    { path: '/admin/worklogs', label: 'Work Logs', icon: Clock },
  ],
  EMPLOYEE: [
    { path: '/employee/tasks', label: 'My Tasks', icon: ClipboardList },
    { path: '/employee/history', label: 'History', icon: Clock },
  ],
};

const sidebarVariants = {
  open: { width: 220, transition: { type: 'spring', stiffness: 200, damping: 25 } },
  closed: { width: 64, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

const itemVariants = {
  open: { opacity: 1, x: 0, transition: { delay: 0.1 } },
  closed: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = navItems[role] || navItems.ADMIN;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full py-4">
      <div className="flex items-center justify-center h-[34px] mb-6 px-3">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-[30px] h-[30px] rounded-[8px] gradient-primary flex items-center justify-center flex-shrink-0">
                <svg className="w-[16px] h-[16px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <span className="text-sm font-bold" style={{ color: '#0F172A' }}>TaskManager</span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-[30px] h-[30px] rounded-[8px] gradient-primary flex items-center justify-center"
            >
              <svg className="w-[16px] h-[16px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobileOnClose?.()}
              className="relative flex items-center gap-3 rounded-[10px] no-underline transition-all duration-200"
              style={{
                height: 40,
                padding: collapsed ? '0 12px' : '0 12px',
                background: isActive ? 'rgba(79,70,229,0.08)' : 'transparent',
                color: isActive ? '#4F46E5' : '#64748B',
              }}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    key="label"
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-[3px] h-[20px] rounded-full"
                  style={{ background: '#4F46E5' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-[10px] bg-transparent border-none cursor-pointer transition-all duration-200"
          style={{ height: 40, padding: collapsed ? '0 12px' : '0 12px', color: '#94A3B8' }}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.5} />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logout"
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="text-sm whitespace-nowrap"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="px-2 mt-1">
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-full rounded-[10px] bg-transparent border-none cursor-pointer transition-all duration-200"
          style={{ height: 36, color: '#94A3B8' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={collapsed ? 'closed' : 'open'}
        className="hidden lg:block fixed left-0 top-[64px] h-[calc(100vh-64px)] z-30 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderRight: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        {sidebarContent}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="fixed left-0 top-[64px] bottom-0 w-[240px] z-50 lg:hidden overflow-y-auto"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.6)',
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}