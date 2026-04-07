import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function CreateAssessment() {
  const [courses, setCourses] = useState([]);
  const [clos, setClos] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ courseId: '', title: '', type: 'Assignment', maxMarks: '', cloMapped: '', date: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/faculty/courses').then(r => setCourses(r.data));
  }, []);

  useEffect(() => {
    if (form.courseId) {
      api.get(`/api/faculty/clos/${form.courseId}`).then(r => setClos(r.data));
      api.get(`/api/faculty/assessments/${form.courseId}`).then(r => setAssessments(r.data));
    }
  }, [form.courseId]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.post('/api/faculty/create-assessment', form);
      setSuccess('Assessment created!');
      const r = await api.get(`/api/faculty/assessments/${form.courseId}`);
      setAssessments(r.data);
      setForm(prev => ({ ...prev, title: '', maxMarks: '', cloMapped: '', date: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Create Assessment">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-xl">📝</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Create Assessment</h2>
              <p className="text-slate-400 text-sm">Quiz, Assignment, or Exam</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">⚠️ {error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Course</label>
              <select name="courseId" className="input-field" value={form.courseId} onChange={handleChange} required>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Title</label>
              <input name="title" className="input-field" placeholder="Midterm Exam" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Type</label>
              <select name="type" className="input-field" value={form.type} onChange={handleChange}>
                <option>Assignment</option><option>Quiz</option><option>Exam</option>
              </select>
            </div>
            <div>
              <label className="label">Max Marks</label>
              <input name="maxMarks" type="number" className="input-field" placeholder="50" value={form.maxMarks} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Map to CLO</label>
              <select name="cloMapped" className="input-field" value={form.cloMapped} onChange={handleChange} required>
                <option value="">-- Select CLO --</option>
                {clos.map(c => <option key={c._id} value={c._id}>CLO {c.cloNumber} – {c.description.slice(0, 40)}...</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input name="date" type="date" className="input-field" value={form.date} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Assessment'}</button>
          </form>
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">Existing Assessments</h3>
          {assessments.length === 0 ? (
            <p className="text-slate-400 text-sm">No assessments created yet.</p>
          ) : (
            <div className="space-y-3">
              {assessments.map(a => (
                <div key={a._id} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{a.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.type === 'Exam' ? 'bg-red-500/20 text-red-400' : a.type === 'Quiz' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{a.type}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Max Marks: {a.maxMarks} · CLO {a.cloMapped?.cloNumber}</p>
                  <p className="text-slate-500 text-xs">{a.date ? new Date(a.date).toLocaleDateString() : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
