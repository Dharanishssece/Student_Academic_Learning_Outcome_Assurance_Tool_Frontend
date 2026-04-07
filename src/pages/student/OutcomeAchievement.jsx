import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function OutcomeAchievement() {
  const [outcomes, setOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/outcomes').then(r => setOutcomes(r.data)).finally(() => setLoading(false));
  }, []);

  const totalCLOs = outcomes.reduce((a, o) => a + o.clos.length, 0);
  const achievedCLOs = outcomes.reduce((a, o) => a + o.clos.filter(c => c.achieved).length, 0);

  return (
    <Layout title="Outcome Achievement">
      {loading ? (
        <div className="flex h-64 items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : outcomes.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-white font-semibold text-lg">No Outcomes Yet</p>
          <p className="text-slate-400 text-sm mt-1">Outcome data will appear once faculty uploads marks.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Total CLOs</p>
              <p className="text-4xl font-bold text-orange-400 mt-1">{totalCLOs}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">CLOs Achieved</p>
              <p className="text-4xl font-bold text-emerald-400 mt-1">{achievedCLOs}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Achievement Rate</p>
              <p className="text-4xl font-bold text-purple-400 mt-1">{totalCLOs > 0 ? Math.round((achievedCLOs / totalCLOs) * 100) : 0}%</p>
            </div>
          </div>

          {/* Per-course CLO breakdown */}
          {outcomes.map(({ course, clos }) => (
            <div key={course._id} className="card">
              <div className="flex items-center gap-3 mb-5">
                <span className="badge-blue">{course.courseCode}</span>
                <h3 className="text-white font-semibold">{course.courseName}</h3>
                <span className="ml-auto text-xs text-slate-400">
                  {clos.filter(c => c.achieved).length}/{clos.length} CLOs Achieved
                </span>
              </div>
              {clos.length === 0 ? (
                <p className="text-slate-400 text-sm">No CLOs defined for this course.</p>
              ) : (
                <div className="space-y-4">
                  {clos.map(clo => (
                    <div key={clo.cloNumber}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="badge-blue text-xs">CLO {clo.cloNumber}</span>
                          <span className={clo.achieved ? 'badge-green' : 'badge-red'}>
                            {clo.achieved ? '✅ Achieved' : '❌ Not Achieved'}
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${clo.achieved ? 'text-emerald-400' : 'text-red-400'}`}>
                          {clo.achievedPercentage}% / {clo.targetPercentage}%
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mb-2">{clo.description}</p>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${clo.achieved ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
                          style={{ width: `${Math.min(clo.achievedPercentage, 100)}%` }}
                        />
                        <div className="absolute top-0 h-full w-0.5 bg-white/50" style={{ left: `${clo.targetPercentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
