import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";
import Loader from "./components/Loader";

import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import AdminCoursesPage from "./pages/admin/CoursesPage";
import AdminAdmissionsPage from "./pages/admin/AdmissionsPage";

import BdeDashboard from "./pages/bde/Dashboard";
import LeadsPage from "./pages/bde/LeadsPage";

import LeadDashboard from "./pages/lead/Dashboard";
import AdmissionFormPage from "./pages/lead/AdmissionFormPage";

import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerCoursesPage from "./pages/trainer/CoursesPage";
import AttendancePage from "./pages/trainer/AttendancePage";
import MaterialsPage from "./pages/trainer/MaterialsPage";
import FeedbackPage from "./pages/trainer/FeedbackPage";

import StudentDashboard from "./pages/student/Dashboard";
import MyCoursesPage from "./pages/student/MyCoursesPage";
import StudentAttendancePage from "./pages/student/AttendancePage";
import StudentMaterialsPage from "./pages/student/MaterialsPage";

function Home() {
  const { loading } = useAuth();
  if (loading) return <Loader full />;
  return <HomePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute role="admin" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/admin/admissions" element={<AdminAdmissionsPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute role="bde" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/bde" element={<BdeDashboard />} />
                <Route path="/bde/leads" element={<LeadsPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute role="lead" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/lead" element={<LeadDashboard />} />
                <Route path="/lead/new-admission" element={<AdmissionFormPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute role="trainer" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/trainer" element={<TrainerDashboard />} />
                <Route path="/trainer/courses" element={<TrainerCoursesPage />} />
                <Route path="/trainer/attendance" element={<AttendancePage />} />
                <Route path="/trainer/materials" element={<MaterialsPage />} />
                <Route path="/trainer/feedback" element={<FeedbackPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute role="student" />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<MyCoursesPage />} />
                <Route path="/student/attendance" element={<StudentAttendancePage />} />
                <Route path="/student/materials" element={<StudentMaterialsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
