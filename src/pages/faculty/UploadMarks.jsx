import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function UploadMarks() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/faculty/courses').then(r => setCourses(r.data));
  }, []);

  useEffect(() => {
    if (courseId) {
      const course = courses.find(c => c._id === courseId);
      setStudents(course?.students || []);
      api.get(`/api/faculty/assessments/${courseId}`).then(r => setAssessments(r.data));
      setMarks({});
    }
  }, [courseId, courses]);

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const marksData = Object.entries(marks).map(([studentId, marksObtained]) => ({
      studentId, courseId, assessmentId, marksObtained: Number(marksObtained)
    }));
    try {
      await api.post('/api/faculty/upload-marks', { marksData });
      setSuccess(`Marks uploaded for ${marksData.length} student(s)!`);
      setMarks({});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload marks.');
    } finally { setLoading(false); }
  };

  const selectedAssessment = assessments.find(a => a._id === assessmentId);

  return (
    <Layout title="Upload Marks">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-600/20 flex items-center justify-center text-xl">📈</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Upload Student Marks</h2>
              <p className="text-slate-400 text-sm">Enter marks for each student per assessment.</p>
            </div>
          </div>

          {/* Step 1: Select Course & Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="label">Select Course</label>
              <select className="input-field" value={courseId} onChange={e => setCourseId(e.target.value)}>
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Select Assessment</label>
              <select className="input-field" value={assessmentId} onChange={e => setAssessmentId(e.target.value)} disabled={!courseId}>
                <option value="">-- Select Assessment --</option>
                {assessments.map(a => <option key={a._id} value={a._id}>{a.title} ({a.type} – {a.maxMarks} marks)</option>)}
              </select>
            </div>
          </div>

          {selectedAssessment && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 mb-5 text-xs text-blue-300">
              📝 {selectedAssessment.title} · Max Marks: <strong>{selectedAssessment.maxMarks}</strong> · CLO {selectedAssessment.cloMapped?.cloNumber}
            </div>
          )}

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">⚠️ {error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm">✅ {success}</div>}

          {students.length > 0 && assessmentId ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-5">
                {students.map(s => (
                  <div key={s._id} className="flex items-center gap-4 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-slate-400 text-xs">{s.regNumber || s.email}</p>
                    </div>
                    <input
                      type="number" min="0" max={selectedAssessment?.maxMarks}
                      className="w-24 bg-slate-800 border border-slate-600 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Marks"
                      value={marks[s._id] || ''}
                      onChange={e => handleMarkChange(s._id, e.target.value)}
                    />
                    <span className="text-slate-500 text-sm">/ {selectedAssessment?.maxMarks}</span>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Marks'}
              </button>
            </form>
          ) : courseId && assessmentId ? (
            <p className="text-slate-400 text-sm">No students enrolled in this course.</p>
          ) : (
            <p className="text-slate-400 text-sm">Select a course and assessment to enter marks.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
