import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageTasks from './pages/admin/ManageTasks';
import AllWorkLogs from './pages/admin/AllWorkLogs';
import MyTasks from './pages/employee/MyTasks';
import TaskDetail from './pages/employee/TaskDetail';
import TaskHistory from './pages/employee/TaskHistory';

export default function App() {
  const { token } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="relative min-h-screen noise-bg">
      {token && (
        <>
          <Navbar
            onToggleSidebar={() => setMobileSidebar(!mobileSidebar)}
            sidebarOpen={mobileSidebar}
          />
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileOpen={mobileSidebar}
            onMobileClose={() => setMobileSidebar(false)}
          />
          <main
            className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[220px]'}`}
            style={{
              marginTop: 64,
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/employees" element={<ProtectedRoute requiredRole="ADMIN"><ManageEmployees /></ProtectedRoute>} />
              <Route path="/admin/tasks" element={<ProtectedRoute requiredRole="ADMIN"><ManageTasks /></ProtectedRoute>} />
              <Route path="/admin/worklogs" element={<ProtectedRoute requiredRole="ADMIN"><AllWorkLogs /></ProtectedRoute>} />
              <Route path="/employee/tasks" element={<ProtectedRoute requiredRole="EMPLOYEE"><MyTasks /></ProtectedRoute>} />
              <Route path="/employee/tasks/:id" element={<ProtectedRoute requiredRole="EMPLOYEE"><TaskDetail /></ProtectedRoute>} />
              <Route path="/employee/history" element={<ProtectedRoute requiredRole="EMPLOYEE"><TaskHistory /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
            </Routes>
          </main>
        </>
      )}
      {!token && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
}