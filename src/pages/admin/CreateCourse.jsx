import { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function CreateCourse() {
  const [form, setForm] = useState({ courseName: '', courseCode: '', department: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const { data } = await api.post('/api/admin/create-course', form);
      setSuccess(`Course "${data.course.courseName}" (${data.course.courseCode}) created successfully!`);
      setForm({ courseName: '', courseCode: '', department: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Create Course">
      <div className="max-w-xl mx-auto">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-xl">📚</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Create New Course</h2>
              <p className="text-slate-400 text-sm">Add a course to the system.</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">⚠️ {error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 mb-5 text-sm">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Course Name</label>
              <input name="courseName" className="input-field" placeholder="Data Structures & Algorithms" value={form.courseName} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Course Code</label>
              <input name="courseCode" className="input-field" placeholder="CS301" value={form.courseCode} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Department</label>
              <input name="department" className="input-field" placeholder="Computer Science" value={form.department} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
