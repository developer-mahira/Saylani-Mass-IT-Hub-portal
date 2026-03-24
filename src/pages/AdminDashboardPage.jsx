import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/common/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminComplaints from "../components/admin/AdminComplaints";
import AdminLostFound from "../components/admin/AdminLostFound";
import AdminVolunteers from "../components/admin/AdminVolunteers";
import AdminUsers from "../components/admin/AdminUsers";
import AdminAnnouncements from "../components/admin/AdminAnnouncements";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="lost-found" element={<AdminLostFound />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
