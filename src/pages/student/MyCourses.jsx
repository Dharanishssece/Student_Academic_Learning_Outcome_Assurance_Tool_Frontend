import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/courses').then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="My Courses">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Enrolled Courses</h2>
          <span className="badge-blue">{courses.length} courses</span>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : courses.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-white font-semibold text-lg">No Courses Yet</p>
            <p className="text-slate-400 text-sm mt-1">You haven't been enrolled in any courses yet. Contact your administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(c => (
              <div key={c._id} className="card hover:border-orange-500/40 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <span className="badge-blue text-sm">{c.courseCode}</span>
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-white font-semibold text-lg leading-snug mb-2">{c.courseName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>👨‍🏫</span>
                    <span>{c.facultyId?.name || <span className="text-amber-400">Unassigned</span>}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>🏛️</span>
                    <span>{c.department || 'No department'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
