import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export default function OutcomeAnalysis() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    api.get('/api/faculty/courses').then(r => setCourses(r.data));
  }, []);

  const fetchAnalysis = async () => {
    if (!courseId) return;
    setLoading(true); setFetched(false);
    try {
      const { data } = await api.get(`/api/faculty/outcome-analysis/${courseId}`);
      setAnalysis(data.analysis || []);
      setFetched(true);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const attained = analysis.filter(a => a.attained).length;

  return (
    <Layout title="Outcome Analysis">
      <div className="space-y-6">
        {/* Course selector */}
        <div className="card flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label">Select Course</label>
            <select className="input-field" value={courseId} onChange={e => { setCourseId(e.target.value); setFetched(false); setAnalysis([]); }}>
              <option value="">-- Select Course --</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchAnalysis} disabled={!courseId || loading} className="btn-primary px-6">
              {loading ? 'Analyzing...' : '📊 Analyze'}
            </button>
          </div>
        </div>

        {fetched && analysis.length > 0 && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Total CLOs</p>
                <p className="text-4xl font-bold text-blue-400 mt-1">{analysis.length}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">CLOs Attained</p>
                <p className="text-4xl font-bold text-emerald-400 mt-1">{attained}</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
                <p className="text-slate-400 text-sm">Attainment Rate</p>
                <p className="text-4xl font-bold text-amber-400 mt-1">{analysis.length > 0 ? Math.round((attained / analysis.length) * 100) : 0}%</p>
              </div>
            </div>

            {/* CLO Results */}
            <div className="card">
              <h3 className="text-white font-semibold mb-5">CLO Attainment Results</h3>
              <div className="space-y-4">
                {analysis.map(clo => (
                  <div key={clo.cloNumber} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge-blue">CLO {clo.cloNumber}</span>
                          <span className={clo.attained ? 'badge-green' : 'badge-red'}>{clo.attained ? '✅ Attained' : '❌ Not Attained'}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{clo.description}</p>
                      </div>
                      <span className={`text-2xl font-bold ml-4 ${clo.attained ? 'text-emerald-400' : 'text-red-400'}`}>{clo.attainmentPercentage}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full transition-all duration-700 ${clo.attained ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
                        style={{ width: `${Math.min(clo.attainmentPercentage, 100)}%` }}
                      />
                      {/* Target marker */}
                      <div className="absolute top-0 h-full w-0.5 bg-white/60" style={{ left: `${clo.targetPercentage}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0%</span>
                      <span className="text-amber-400">Target: {clo.targetPercentage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {fetched && analysis.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-slate-400">No CLOs defined for this course yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
