import { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AddStudent() {
  const [form, setForm] = useState({ name: '', regNumber: '', department: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const { data } = await api.post('/api/admin/add-student', form);
      setResult(data);
      setForm({ name: '', regNumber: '', department: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student.');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Add Student">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-xl">👤</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add New Student</h2>
              <p className="text-slate-400 text-sm">Credentials will be auto-generated.</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" type="text" className="input-field" placeholder="John Smith" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Registration Number</label>
              <input name="regNumber" type="text" className="input-field" placeholder="CS2024001" value={form.regNumber} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Department</label>
              <input name="department" type="text" className="input-field" placeholder="Computer Science" value={form.department} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Adding Student...' : 'Add Student'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-emerald-400 font-semibold text-lg">Student Created Successfully!</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Name:</span><span className="text-white font-medium">{result.student.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Reg No:</span><span className="text-white font-medium">{result.student.regNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email:</span><span className="text-blue-400 font-medium">{result.credentials.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Password:</span><span className="text-blue-400 font-medium">{result.credentials.password}</span></div>
            </div>
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-400">
              ⚠️ Please share these credentials with the student securely.
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
