import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

// Lazy load student components
const StudentOverview = lazy(() => import("../components/student/StudentOverview"));
const LostFoundForm = lazy(() => import("../components/student/LostFoundForm"));
const LostFoundList = lazy(() => import("../components/student/LostFoundList"));
const ComplaintForm = lazy(() => import("../components/student/ComplaintForm"));
const ComplaintList = lazy(() => import("../components/student/ComplaintList"));
const VolunteerForm = lazy(() => import("../components/student/VolunteerForm"));
const NotificationFeed = lazy(() => import("../components/student/NotificationFeed"));
const StudentProfile = lazy(() => import("../components/student/StudentProfile"));

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin w-8 h-8 border-4 border-[#66b032] border-t-transparent rounded-full" />
  </div>
);

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<StudentOverview />} />
              <Route path="/lost-found" element={
                <div className="grid lg:grid-cols-2 gap-6">
                  <LostFoundForm />
                  <LostFoundList />
                </div>
              } />
              <Route path="/complaints" element={
                <div className="grid lg:grid-cols-2 gap-6">
                  <ComplaintForm />
                  <ComplaintList />
                </div>
              } />
              <Route path="/volunteer" element={<VolunteerForm />} />
              <Route path="/notifications" element={<NotificationFeed />} />
              <Route path="/profile" element={<StudentProfile />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

