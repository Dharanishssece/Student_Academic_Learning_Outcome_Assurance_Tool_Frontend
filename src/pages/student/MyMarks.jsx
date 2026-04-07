import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function MyMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/marks').then(r => setMarks(r.data)).finally(() => setLoading(false));
  }, []);

  const grouped = marks.reduce((acc, m) => {
    const key = m.courseId?._id;
    if (!acc[key]) acc[key] = { course: m.courseId, marks: [] };
    acc[key].marks.push(m);
    return acc;
  }, {});

  return (
    <Layout title="My Marks">
      {loading ? (
        <div className="flex h-64 items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : marks.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🎓</p>
          <p className="text-white font-semibold text-lg">No Marks Yet</p>
          <p className="text-slate-400 text-sm mt-1">Your marks will appear here once faculty uploads them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(grouped).map(({ course, marks }) => {
            const totalObtained = marks.reduce((a, m) => a + m.marksObtained, 0);
            const totalMax = marks.reduce((a, m) => a + (m.assessmentId?.maxMarks || 0), 0);
            const pct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
            return (
              <div key={course?._id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="badge-blue mr-2">{course?.courseCode}</span>
                    <span className="text-white font-semibold">{course?.courseName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Overall</p>
                    <p className={`text-xl font-bold ${pct >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>{pct}%</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="table-header text-left py-2 px-3">Assessment</th>
                        <th className="table-header text-left py-2 px-3">Type</th>
                        <th className="table-header text-left py-2 px-3">CLO</th>
                        <th className="table-header text-right py-2 px-3">Marks</th>
                        <th className="table-header text-right py-2 px-3">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {marks.map(m => {
                        const mp = m.assessmentId?.maxMarks ? Math.round((m.marksObtained / m.assessmentId.maxMarks) * 100) : 0;
                        return (
                          <tr key={m._id} className="hover:bg-slate-700/20 transition-colors">
                            <td className="table-cell">{m.assessmentId?.title || '—'}</td>
                            <td className="table-cell text-slate-400">{m.assessmentId?.type || '—'}</td>
                            <td className="table-cell text-slate-400">CLO {m.assessmentId?.cloMapped?.cloNumber || '—'}</td>
                            <td className="table-cell text-right font-semibold text-white">{m.marksObtained} / {m.assessmentId?.maxMarks || '—'}</td>
                            <td className="table-cell text-right">
                              <span className={mp >= 60 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{mp}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
