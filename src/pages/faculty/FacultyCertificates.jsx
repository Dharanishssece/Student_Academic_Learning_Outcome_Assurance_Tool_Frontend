import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function FacultyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/api/faculty/certificates')
      .then(r => setCerts(r.data))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
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
    <Layout title="Student Certificates">
      <div className="space-y-6">

        {/* Page Header */}
        <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-violet-800/20 border border-violet-500/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-1">Student Certificates 📄</h2>
          <p className="text-slate-400 text-sm">
            View all certificates uploaded by students.{' '}
            {!loading && <span className="text-violet-400 font-semibold">{certs.length} total</span>}
          </p>
        </div>

        {/* Main Card */}
        <div className="card">

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Filter results:</span>
              {filter && (
                <span className="badge-blue">{filtered.length} match{filtered.length !== 1 ? 'es' : ''}</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Search by name, email, course or certificate…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="input-field sm:w-80 text-sm py-2"
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

          ) : filtered.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <span className="text-5xl">📭</span>
              <p className="text-slate-300 font-semibold text-lg">
                {filter ? 'No certificates match your search.' : 'No certificates uploaded yet.'}
              </p>
              <p className="text-slate-500 text-sm">
                Students can upload certificates from their dashboard under "Upload Certificates".
              </p>
            </div>

          ) : (
            /* Table */
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    <th className="table-header py-3 px-4 text-left">#</th>
                    <th className="table-header py-3 px-4 text-left">Student Name</th>
                    <th className="table-header py-3 px-4 text-left">Email</th>
                    <th className="table-header py-3 px-4 text-left">Course</th>
                    <th className="table-header py-3 px-4 text-left">Certificate Name</th>
                    <th className="table-header py-3 px-4 text-left">Upload Date</th>
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

                      <td className="table-cell font-medium text-white">
                        {cert.studentName}
                      </td>

                      <td className="table-cell text-slate-400">
                        {cert.studentEmail}
                      </td>

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
                          <span
                            className="truncate max-w-[180px]"
                            title={cert.certificateTitle}
                          >
                            {cert.certificateTitle}
                          </span>
                        </span>
                      </td>

                      <td className="table-cell text-slate-400 whitespace-nowrap">
                        {cert.createdAt
                          ? new Date(cert.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      <td className="table-cell">
                        <a
                          href={`${backendUrl}${cert.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm shadow-blue-600/30"
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
      </div>
    </Layout>
  );
}
