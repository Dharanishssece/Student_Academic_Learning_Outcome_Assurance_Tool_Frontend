import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0, totalCourses: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [repRes, usersRes] = await Promise.all([
          api.get('/api/admin/reports'),
          api.get('/api/admin/users'),
        ]);
        setStats(repRes.data);
        setRecentUsers(usersRes.data.slice(0, 5));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: '👤', color: 'from-blue-600/20 to-blue-800/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    { label: 'Total Faculty', value: stats.totalFaculty, icon: '👨‍🏫', color: 'from-emerald-600/20 to-emerald-800/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    { label: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'from-purple-600/20 to-purple-800/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  ];

  const quickLinks = [
    { to: '/admin/add-student', label: 'Add Student', icon: '👤', desc: 'Register a new student' },
    { to: '/admin/add-faculty', label: 'Add Faculty', icon: '👨‍🏫', desc: 'Register a new faculty member' },
    { to: '/admin/create-course', label: 'Create Course', icon: '📚', desc: 'Add a new course' },
    { to: '/admin/assign-faculty', label: 'Assign Faculty', icon: '🔗', desc: 'Assign faculty to courses' },
    { to: '/admin/reports', label: 'View Reports', icon: '📊', desc: 'See system analytics' },
  ];

  return (
    <Layout title="Admin Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-800/20 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Admin! 👋</h2>
            <p className="text-slate-400 text-sm">Here's an overview of your SALO Tool system.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {statCards.map(card => (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 shadow-xl`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{card.icon}</span>
                  <span className={`text-4xl font-bold ${card.text}`}>{card.value}</span>
                </div>
                <p className="text-slate-300 font-medium">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className="card flex items-start gap-4 hover:border-blue-500/50 hover:bg-slate-700/60 transition-all duration-200 group cursor-pointer">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{link.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{link.label}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
            {recentUsers.length === 0 ? (
              <p className="text-slate-400 text-sm">No users added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="table-header text-left py-3 px-4">Name</th>
                      <th className="table-header text-left py-3 px-4">Email</th>
                      <th className="table-header text-left py-3 px-4">Role</th>
                      <th className="table-header text-left py-3 px-4">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {recentUsers.map(u => (
                      <tr key={u._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="table-cell font-medium">{u.name}</td>
                        <td className="table-cell text-slate-400">{u.email}</td>
                        <td className="table-cell">
                          <span className={u.role === 'admin' ? 'badge-blue' : u.role === 'faculty' ? 'badge-green' : 'badge-red'}>
                            {u.role}
                          </span>
                        </td>
                        <td className="table-cell text-slate-400">{u.department || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
