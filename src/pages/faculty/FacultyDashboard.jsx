import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function FacultyDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/faculty/courses').then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/faculty/create-clo', label: 'Create CLO', icon: '🎯', desc: 'Define learning outcomes' },
    { to: '/faculty/create-assessment', label: 'Create Assessment', icon: '📝', desc: 'Add quiz, exam or assignment' },
    { to: '/faculty/upload-marks', label: 'Upload Marks', icon: '📈', desc: 'Enter student marks' },
    { to: '/faculty/outcome-analysis', label: 'Outcome Analysis', icon: '📊', desc: 'View CLO attainment' },
  ];

  return (
    <Layout title="Faculty Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-emerald-800/20 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-1">Faculty Dashboard 👨‍🏫</h2>
            <p className="text-slate-400 text-sm">You are managing <span className="text-emerald-400 font-semibold">{courses.length}</span> course(s).</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Assigned Courses</p>
              <p className="text-4xl font-bold text-emerald-400 mt-1">{courses.length}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Total Students</p>
              <p className="text-4xl font-bold text-blue-400 mt-1">{courses.reduce((acc, c) => acc + (c.students?.length || 0), 0)}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map(link => (
                <Link key={link.to} to={link.to} className="card flex items-start gap-4 hover:border-emerald-500/50 hover:bg-slate-700/60 transition-all duration-200 group">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{link.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{link.label}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Assigned Courses */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">My Courses</h3>
            {courses.length === 0 ? (
              <p className="text-slate-400 text-sm">No courses assigned yet. Contact the administrator.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map(c => (
                  <div key={c._id} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge-blue">{c.courseCode}</span>
                      <span className="badge-green">{c.students?.length || 0} students</span>
                    </div>
                    <p className="text-white font-semibold">{c.courseName}</p>
                    <p className="text-slate-400 text-sm mt-1">{c.department || 'No department'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
