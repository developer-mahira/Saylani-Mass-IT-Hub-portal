import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import StudentOverview from "../components/student/StudentOverview";
import LostFoundForm from "../components/student/LostFoundForm";
import LostFoundList from "../components/student/LostFoundList";
import ComplaintForm from "../components/student/ComplaintForm";
import ComplaintList from "../components/student/ComplaintList";
import VolunteerForm from "../components/student/VolunteerForm";
import NotificationFeed from "../components/student/NotificationFeed";
import StudentProfile from "../components/student/StudentProfile";

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route index element={<StudentOverview />} />
            <Route
              path="lost-found"
              element={
                <div className="grid lg:grid-cols-2 gap-6">
                  <LostFoundForm />
                  <LostFoundList />
                </div>
              }
            />
            <Route
              path="complaints"
              element={
                <div className="grid lg:grid-cols-2 gap-6">
                  <ComplaintForm />
                  <ComplaintList />
                </div>
              }
            />
            <Route path="volunteer" element={<VolunteerForm />} />
            <Route path="notifications" element={<NotificationFeed />} />
            <Route path="profile" element={<StudentProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
