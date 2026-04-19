import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AddStudent from './pages/admin/AddStudent';
import AddFaculty from './pages/admin/AddFaculty';
import CreateCourse from './pages/admin/CreateCourse';
import AssignFaculty from './pages/admin/AssignFaculty';
import Reports from './pages/admin/Reports';

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CreateCLO from './pages/faculty/CreateCLO';
import CreateAssessment from './pages/faculty/CreateAssessment';
import UploadMarks from './pages/faculty/UploadMarks';
import OutcomeAnalysis from './pages/faculty/OutcomeAnalysis';
import FacultyCertificates from './pages/faculty/FacultyCertificates';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import MyMarks from './pages/student/MyMarks';
import OutcomeAchievement from './pages/student/OutcomeAchievement';
import UploadCertificates from './pages/student/UploadCertificates';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-student" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />
          <Route path="/admin/add-faculty" element={<ProtectedRoute allowedRoles={['admin']}><AddFaculty /></ProtectedRoute>} />
          <Route path="/admin/create-course" element={<ProtectedRoute allowedRoles={['admin']}><CreateCourse /></ProtectedRoute>} />
          <Route path="/admin/assign-faculty" element={<ProtectedRoute allowedRoles={['admin']}><AssignFaculty /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />

          {/* Faculty */}
          <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/faculty/create-clo" element={<ProtectedRoute allowedRoles={['faculty']}><CreateCLO /></ProtectedRoute>} />
          <Route path="/faculty/create-assessment" element={<ProtectedRoute allowedRoles={['faculty']}><CreateAssessment /></ProtectedRoute>} />
          <Route path="/faculty/upload-marks" element={<ProtectedRoute allowedRoles={['faculty']}><UploadMarks /></ProtectedRoute>} />
          <Route path="/faculty/outcome-analysis" element={<ProtectedRoute allowedRoles={['faculty']}><OutcomeAnalysis /></ProtectedRoute>} />
          <Route path="/faculty/certificates" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyCertificates /></ProtectedRoute>} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/courses" element={<ProtectedRoute allowedRoles={['student']}><MyCourses /></ProtectedRoute>} />
          <Route path="/student/marks" element={<ProtectedRoute allowedRoles={['student']}><MyMarks /></ProtectedRoute>} />
          <Route path="/student/outcomes" element={<ProtectedRoute allowedRoles={['student']}><OutcomeAchievement /></ProtectedRoute>} />
          <Route path="/student/upload-certificate" element={<ProtectedRoute allowedRoles={['student']}><UploadCertificates /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
