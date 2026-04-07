import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/student/courses'),
      api.get('/api/student/marks'),
    ]).then(([c, m]) => { setCourses(c.data); setMarks(m.data); }).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/student/courses', label: 'My Courses', icon: '📚', desc: 'View enrolled courses' },
    { to: '/student/marks', label: 'My Marks', icon: '🎓', desc: 'Check your assessment marks' },
    { to: '/student/outcomes', label: 'Outcome Achievement', icon: '🏆', desc: 'Track CLO attainment' },
    { to: '/student/upload-certificate', label: 'Upload Certificates', icon: '📎', desc: 'Upload achievement certificates' },
  ];

  const avgMarksPercent = marks.length > 0
    ? Math.round(marks.reduce((acc, m) => acc + (m.assessmentId?.maxMarks ? (m.marksObtained / m.assessmentId.maxMarks) * 100 : 0), 0) / marks.length)
    : 0;

  return (
    <Layout title="Student Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-8">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-orange-600/20 via-amber-600/20 to-orange-800/20 border border-orange-500/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-slate-400 text-sm">Track your academic progress and learning outcomes here.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Enrolled Courses</p>
              <p className="text-4xl font-bold text-orange-400 mt-1">{courses.length}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Assessments Taken</p>
              <p className="text-4xl font-bold text-blue-400 mt-1">{marks.length}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Avg. Score</p>
              <p className="text-4xl font-bold text-purple-400 mt-1">{avgMarksPercent}%</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map(link => (
                <Link key={link.to} to={link.to} className="card flex items-start gap-4 hover:border-orange-500/50 hover:bg-slate-700/60 transition-all duration-200 group">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{link.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{link.label}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Marks */}
          {marks.length > 0 && (
            <div className="card">
              <h3 className="text-white font-semibold mb-4">Recent Marks</h3>
              <div className="space-y-3">
                {marks.slice(0, 4).map(m => {
                  const pct = m.assessmentId?.maxMarks ? Math.round((m.marksObtained / m.assessmentId.maxMarks) * 100) : 0;
                  return (
                    <div key={m._id} className="flex items-center gap-4 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{m.assessmentId?.title || 'Assessment'}</p>
                        <p className="text-slate-400 text-xs">{m.courseId?.courseName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{m.marksObtained} / {m.assessmentId?.maxMarks}</p>
                        <p className={`text-xs font-medium ${pct >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>{pct}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
