import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  Users,
  ClipboardList,
  Clock,
  UserCircle,
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

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 18 } },
};

function NotificationDropdown({ onClose }) {
  const notifications = [
    { id: 1, text: 'New employee John added', time: '2 min ago', type: 'info' },
    { id: 2, text: 'Task "Design UI" completed', time: '15 min ago', type: 'success' },
    { id: 3, text: 'Deadline approaching for Project X', time: '1 hour ago', type: 'warning' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute right-0 top-full mt-2 w-[340px] max-w-[90vw] rounded-[14px] overflow-hidden z-50"
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 25px 60px rgba(15,23,42,0.12)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>Notifications</span>
        <button className="text-xs font-medium bg-transparent border-none cursor-pointer" style={{ color: '#4F46E5' }}>Mark all read</button>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-[#F8FAFC]"
          >
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{
                background: n.type === 'success' ? '#22C55E' : n.type === 'warning' ? '#F59E0B' : '#4F46E5',
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: '#0F172A' }}>{n.text}</p>
              <span className="text-xs" style={{ color: '#94A3B8' }}>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProfileDropdown({ fullName, email, role, onLogout, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute right-0 top-full mt-2 w-[260px] max-w-[90vw] rounded-[14px] overflow-hidden z-50"
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 25px 60px rgba(15,23,42,0.12)',
      }}
    >
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
            {fullName?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>{fullName || 'User'}</p>
            <p className="text-xs truncate" style={{ color: '#94A3B8' }}>{email || ''}</p>
          </div>
        </div>
        <div className="mt-2">
          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,70,229,0.08)', color: '#4F46E5' }}>
            {role}
          </span>
        </div>
      </div>
      <div className="py-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 bg-transparent border-none cursor-pointer" style={{ color: '#475569' }}
          onClick={onClose}>
          <Settings className="w-4 h-4" strokeWidth={1.5} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 bg-transparent border-none cursor-pointer" style={{ color: '#EF4444' }}
          onClick={onLogout}>
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </motion.div>
  );
}

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { role, fullName, email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const items = navItems[role] || navItems.ADMIN;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handle = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-40 w-full h-[64px] flex items-center justify-between px-4 lg:px-6"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.8)',
        }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-transparent border-none cursor-pointer"
            style={{ color: '#64748B' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </motion.button>

          <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
            <motion.div
              className="w-[34px] h-[34px] rounded-[10px] gradient-primary flex items-center justify-center"
              whileHover={{ rotate: -8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </motion.div>
            <span className="hidden sm:block text-base font-bold" style={{ color: '#0F172A' }}>
              Task<span style={{ color: '#4F46E5' }}>Manager</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-6">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-all duration-200"
                  style={{
                    color: isActive ? '#4F46E5' : '#64748B',
                    background: isActive ? 'rgba(79,70,229,0.06)' : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                      style={{ background: '#4F46E5' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="relative hidden sm:block"
            animate={{ width: searchFocused ? 280 : 200 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: searchFocused ? '#4F46E5' : '#94A3B8' }} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-[36px] pl-9 pr-3 text-sm rounded-[10px] outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: searchFocused ? '1px solid #6366F1' : '1px solid #E2E8F0',
                color: '#0F172A',
                boxShadow: searchFocused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
              }}
              aria-label="Search"
            />
          </motion.div>

          <div className="relative" ref={notifRef}>
            <motion.button
              className="relative p-2 rounded-[10px] bg-transparent border-none cursor-pointer"
              style={{ color: '#64748B' }}
              whileHover={{ scale: 1.05, background: 'rgba(79,70,229,0.06)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <motion.span
                className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full"
                style={{ background: '#EF4444' }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            <AnimatePresence>
              {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <motion.button
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-[10px] bg-transparent border-none cursor-pointer"
              whileHover={{ background: 'rgba(79,70,229,0.06)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
              aria-label="Profile menu"
            >
              <motion.div
                className="w-[32px] h-[32px] rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold"
                whileHover={{ scale: 1.05 }}
              >
                {getInitials(fullName)}
              </motion.div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium leading-tight" style={{ color: '#0F172A' }}>{fullName || 'User'}</p>
                <p className="text-[10px] leading-tight" style={{ color: '#94A3B8' }}>{role}</p>
              </div>
              <ChevronDown className="hidden lg:block w-3.5 h-3.5" style={{ color: '#94A3B8' }} strokeWidth={2} />
            </motion.button>
            <AnimatePresence>
              {showProfile && (
                <ProfileDropdown
                  fullName={fullName}
                  email={email}
                  role={role}
                  onLogout={handleLogout}
                  onClose={() => setShowProfile(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
}