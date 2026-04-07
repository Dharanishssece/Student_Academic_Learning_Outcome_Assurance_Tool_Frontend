import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function CreateCLO() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: '', cloNumber: '', description: '', targetPercentage: 60 });
  const [clos, setClos] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/faculty/courses').then(r => setCourses(r.data));
  }, []);

  useEffect(() => {
    if (form.courseId) {
      api.get(`/api/faculty/clos/${form.courseId}`).then(r => setClos(r.data));
    }
  }, [form.courseId]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.post('/api/faculty/create-clo', form);
      setSuccess(`CLO ${form.cloNumber} created successfully!`);
      const r = await api.get(`/api/faculty/clos/${form.courseId}`);
      setClos(r.data);
      setForm(prev => ({ ...prev, cloNumber: '', description: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create CLO.');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Create CLO">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 flex items-center justify-center text-xl">🎯</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Create Course Learning Outcome</h2>
              <p className="text-slate-400 text-sm">Define CLOs for your course.</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">⚠️ {error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select Course</label>
              <select name="courseId" className="input-field" value={form.courseId} onChange={handleChange} required>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
              </select>
            </div>
            <div>
              <label className="label">CLO Number</label>
              <input name="cloNumber" type="number" min="1" className="input-field" placeholder="1" value={form.cloNumber} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea name="description" className="input-field" rows={3} placeholder="Students will be able to..." value={form.description} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Target Attainment % (default: 60%)</label>
              <input name="targetPercentage" type="number" min="1" max="100" className="input-field" value={form.targetPercentage} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create CLO'}</button>
          </form>
        </div>

        {/* CLOs List */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4">CLOs for Selected Course</h3>
          {clos.length === 0 ? (
            <p className="text-slate-400 text-sm">No CLOs yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {clos.map(clo => (
                <div key={clo._id} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge-blue">CLO {clo.cloNumber}</span>
                    <span className="text-xs text-slate-400">Target: {clo.targetPercentage}%</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{clo.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
