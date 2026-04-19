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

          {/* ── Student Certificates ── */}
          <StudentCertificates />
        </div>
      )}
    </Layout>
  );
}

/* ─────────────────────────────────────────────
   Student Certificates sub-component
   – fetched fresh on mount, filterable by name / course
───────────────────────────────────────────── */
function StudentCertificates() {
  const [certs, setCerts] = useState([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/api/faculty/certificates')
      .then(r => setCerts(r.data))
      .catch(() => setCerts([]))
      .finally(() => setCertsLoading(false));
  }, []);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const filtered = certs.filter(cert => {
    const q = filter.toLowerCase();
    return (
      cert.studentName?.toLowerCase().includes(q) ||
      cert.studentEmail?.toLowerCase().includes(q) ||
      cert.course?.toLowerCase().includes(q) ||
      cert.certificateTitle?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="card">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center text-lg">🎓</div>
          <h3 className="text-lg font-semibold text-white">Student Certificates</h3>
          {!certsLoading && (
            <span className="badge-blue">{certs.length} total</span>
          )}
        </div>
        {/* Filter input */}
        <input
          type="text"
          placeholder="Filter by name, email or course…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="input-field sm:w-72 text-sm py-2"
        />
      </div>

      {/* Loading state */}
      {certsLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <span className="text-4xl">📭</span>
          <p className="text-slate-300 font-medium">
            {filter ? 'No certificates match your filter.' : 'No certificates uploaded yet.'}
          </p>
          <p className="text-slate-500 text-sm">Students can upload certificates from their dashboard.</p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-700/60">
                <th className="table-header py-3 px-4 text-left">#</th>
                <th className="table-header py-3 px-4 text-left">Student Name</th>
                <th className="table-header py-3 px-4 text-left">Email</th>
                <th className="table-header py-3 px-4 text-left">Course</th>
                <th className="table-header py-3 px-4 text-left">Certificate Name</th>
                <th className="table-header py-3 px-4 text-left">Uploaded Date</th>
                <th className="table-header py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert, idx) => (
                <tr
                  key={cert._id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-150"
                >
                  <td className="table-cell text-slate-500">{idx + 1}</td>
                  <td className="table-cell font-medium text-white">{cert.studentName}</td>
                  <td className="table-cell text-slate-400">{cert.studentEmail}</td>
                  <td className="table-cell">
                    {cert.course ? (
                      <span className="badge-blue">{cert.course}</span>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <span>📄</span>
                      <span className="truncate max-w-[160px]" title={cert.certificateTitle}>
                        {cert.certificateTitle}
                      </span>
                    </span>
                  </td>
                  <td className="table-cell text-slate-400 whitespace-nowrap">
                    {cert.createdAt
                      ? new Date(cert.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="table-cell">
                    <a
                      href={`${backendUrl}${cert.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      👁️ View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
