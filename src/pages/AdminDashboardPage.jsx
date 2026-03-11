import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/common/AdminSidebar";

// Lazy load admin components
const AdminOverview = lazy(() => import("../components/admin/AdminOverview"));
const AdminComplaints = lazy(() => import("../components/admin/AdminComplaints"));
const AdminLostFound = lazy(() => import("../components/admin/AdminLostFound"));
const AdminVolunteers = lazy(() => import("../components/admin/AdminVolunteers"));
const AdminUsers = lazy(() => import("../components/admin/AdminUsers"));
const AdminAnnouncements = lazy(() => import("../components/admin/AdminAnnouncements"));

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin w-8 h-8 border-4 border-[#66b032] border-t-transparent rounded-full" />
  </div>
);

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/complaints" element={<AdminComplaints />} />
              <Route path="/lost-found" element={<AdminLostFound />} />
              <Route path="/volunteers" element={<AdminVolunteers />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/announcements" element={<AdminAnnouncements />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

