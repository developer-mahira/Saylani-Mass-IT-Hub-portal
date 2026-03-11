import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy, useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy load pages for performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const StudentDashboardPage = lazy(() => import("./pages/StudentDashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

// Global loading spinner for app initialization ONLY
const GlobalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#66b032] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Loading SMIT Hub...</p>
    </div>
  </div>
);

// Initial app loader - shows only once during Firebase initialization
function InitialLoader() {
  const [showLoader, setShowLoader] = useState(true);
  const { initialized } = useAuth();

  useEffect(() => {
    if (initialized) {
      // Keep loader for a moment to show user feedback
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialized]);

  if (!showLoader) return null;
  
  return <GlobalLoader />;
}

// Public route wrapper - NEVER blocks on auth loading
// Shows content immediately, auth is checked in background
const PublicRoute = ({ children }) => {
  return children;
};

function AppRoutes() {
  const { loading, initialized } = useAuth();

  // Show global loader only on first load (before Firebase initializes)
  if (!initialized && loading) {
    return <GlobalLoader />;
  }

  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        {/* Public Routes - These ALWAYS render, no auth check needed */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Student Routes - Protected */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes - Protected */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Fallback - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
            success: { iconTheme: { primary: "#66b032", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

