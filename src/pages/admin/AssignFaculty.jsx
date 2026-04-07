import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AssignFaculty() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/courses'),
      api.get('/api/admin/users?role=faculty'),
      api.get('/api/admin/users?role=student'),
    ]).then(([c, f, s]) => {
      setCourses(c.data); setFaculty(f.data); setStudents(s.data);
    }).catch(console.error);
  }, []);

  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.put('/api/admin/assign-faculty', { courseId, facultyId });
      setSuccess('Faculty assigned successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed.');
    } finally { setLoading(false); }
  };

  const handleAssignStudents = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.put('/api/admin/assign-students', { courseId, studentIds: selectedStudents });
      setSuccess(`${selectedStudents.length} student(s) assigned to course!`);
      setSelectedStudents([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed.');
    } finally { setLoading(false); }
  };

  const toggleStudent = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <Layout title="Assign Faculty & Students">
      <div className="max-w-2xl mx-auto space-y-6">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">⚠️ {error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">✅ {success}</div>}

        {/* Assign Faculty */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-xl">🔗</div>
            <h2 className="text-lg font-semibold text-white">Assign Faculty to Course</h2>
          </div>
          <form onSubmit={handleAssignFaculty} className="space-y-4">
            <div>
              <label className="label">Select Course</label>
              <select className="input-field" value={courseId} onChange={e => setCourseId(e.target.value)} required>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Select Faculty</label>
              <select className="input-field" value={facultyId} onChange={e => setFacultyId(e.target.value)} required>
                <option value="">-- Select Faculty --</option>
                {faculty.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department || 'N/A'})</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Faculty'}
            </button>
          </form>
        </div>

        {/* Assign Students */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-xl">👥</div>
            <h2 className="text-lg font-semibold text-white">Enroll Students in Course</h2>
          </div>
          <form onSubmit={handleAssignStudents} className="space-y-4">
            <div>
              <label className="label">Select Course</label>
              <select className="input-field" value={courseId} onChange={e => setCourseId(e.target.value)} required>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Select Students ({selectedStudents.length} selected)</label>
              <div className="max-h-48 overflow-y-auto space-y-1 mt-2 bg-slate-900/60 rounded-xl p-3">
                {students.length === 0 ? <p className="text-slate-400 text-sm">No students found.</p> : students.map(s => (
                  <label key={s._id} className="flex items-center gap-3 p-2 hover:bg-slate-700/40 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={selectedStudents.includes(s._id)} onChange={() => toggleStudent(s._id)} className="w-4 h-4 accent-blue-500" />
                    <span className="text-sm text-white">{s.name}</span>
                    <span className="text-xs text-slate-400 ml-auto">{s.regNumber}</span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading || selectedStudents.length === 0}>
              {loading ? 'Enrolling...' : `Enroll ${selectedStudents.length} Student(s)`}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
