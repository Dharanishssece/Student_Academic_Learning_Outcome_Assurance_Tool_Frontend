import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/add-student', label: 'Add Student', icon: '👤' },
  { to: '/admin/add-faculty', label: 'Add Faculty', icon: '👨‍🏫' },
  { to: '/admin/create-course', label: 'Create Course', icon: '📚' },
  { to: '/admin/assign-faculty', label: 'Assign Faculty', icon: '🔗' },
  { to: '/admin/reports', label: 'Reports', icon: '📊' },
];

const facultyLinks = [
  { to: '/faculty', label: 'Dashboard', icon: '🏠' },
  { to: '/faculty/create-clo', label: 'Create CLO', icon: '🎯' },
  { to: '/faculty/create-assessment', label: 'Create Assessment', icon: '📝' },
  { to: '/faculty/upload-marks', label: 'Upload Marks', icon: '📈' },
  { to: '/faculty/outcome-analysis', label: 'Outcome Analysis', icon: '📉' },
];

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: '🏠' },
  { to: '/student/courses', label: 'My Courses', icon: '📚' },
  { to: '/student/marks', label: 'My Marks', icon: '🎓' },
  { to: '/student/outcomes', label: 'Outcome Achievement', icon: '🏆' },
  { to: '/student/upload-certificate', label: 'Upload Certificates', icon: '📎' },
];

const roleLinks = { admin: adminLinks, faculty: facultyLinks, student: studentLinks };
const roleColors = {
  admin: 'from-blue-600 to-purple-600',
  faculty: 'from-emerald-600 to-teal-600',
  student: 'from-orange-500 to-amber-500',
};
const roleLabels = { admin: 'Administrator', faculty: 'Faculty', student: 'Student' };

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const links = roleLinks[user?.role] || [];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700/50">
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${roleColors[user?.role]} px-3 py-1.5 rounded-lg mb-3`}>
          <span className="text-white text-xs font-bold tracking-wider uppercase">{roleLabels[user?.role]}</span>
        </div>
        <h1 className="text-xl font-bold text-white">SALO Tool</h1>
        <p className="text-xs text-slate-400 mt-0.5">OBE Tracking System</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive = link.to === `/${user?.role}`
            ? location.pathname === link.to
            : location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[user?.role]} flex items-center justify-center text-white font-bold text-sm`}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
