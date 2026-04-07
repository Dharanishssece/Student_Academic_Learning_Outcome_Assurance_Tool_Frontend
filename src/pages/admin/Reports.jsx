import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function Reports() {
  const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0, totalCourses: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/reports'),
      api.get('/api/admin/users'),
      api.get('/api/admin/courses'),
    ]).then(([r, u, c]) => {
      setStats(r.data); setUsers(u.data); setCourses(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await api.delete(`/api/admin/users/${id}`); setUsers(prev => prev.filter(u => u._id !== id)); }
    catch (e) { alert('Failed to delete user.'); }
  };

  return (
    <Layout title="Reports & Analytics">
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Students', value: stats.totalStudents, icon: '👤', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
              { label: 'Faculty', value: stats.totalFaculty, icon: '👨‍🏫', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
              { label: 'Courses', value: stats.totalCourses, icon: '📚', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border rounded-2xl p-5 flex items-center justify-between`}>
                <div>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                  <p className={`text-4xl font-bold ${s.color} mt-1`}>{s.value}</p>
                </div>
                <span className="text-4xl opacity-60">{s.icon}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {['users', 'courses'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{t}</button>
            ))}
          </div>

          {/* Users Table */}
          {tab === 'users' && (
            <div className="card overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">All Users ({users.length})</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Name', 'Email', 'Role', 'Department', 'Action'].map(h => (
                      <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="table-cell font-medium">{u.name}</td>
                      <td className="table-cell text-slate-400 text-xs">{u.email}</td>
                      <td className="table-cell"><span className={u.role === 'admin' ? 'badge-blue' : u.role === 'faculty' ? 'badge-green' : 'badge-red'}>{u.role}</span></td>
                      <td className="table-cell text-slate-400">{u.department || '—'}</td>
                      <td className="table-cell">{u.role !== 'admin' && <button onClick={() => handleDelete(u._id)} className="btn-danger text-xs py-1 px-3">Delete</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Courses Table */}
          {tab === 'courses' && (
            <div className="card overflow-x-auto">
              <h3 className="text-white font-semibold mb-4">All Courses ({courses.length})</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Course', 'Code', 'Faculty', 'Students', 'Department'].map(h => (
                      <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {courses.map(c => (
                    <tr key={c._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="table-cell font-medium">{c.courseName}</td>
                      <td className="table-cell"><span className="badge-blue">{c.courseCode}</span></td>
                      <td className="table-cell text-slate-400">{c.facultyId?.name || <span className="text-amber-400 text-xs">Unassigned</span>}</td>
                      <td className="table-cell"><span className="badge-green">{c.students?.length || 0} students</span></td>
                      <td className="table-cell text-slate-400">{c.department || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
