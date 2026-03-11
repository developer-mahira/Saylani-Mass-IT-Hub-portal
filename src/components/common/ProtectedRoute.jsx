import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Reusable loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin w-12 h-12 border-4 border-[#66b032] border-t-transparent rounded-full" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading, initialized } = useAuth();

  // While initial auth check is in progress, show spinner
  // This happens only on first load
  if (loading && !initialized) {
    return <LoadingSpinner />;
  }

  // No user - redirect to login
  if (!currentUser) {
    console.log("ProtectedRoute: No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // User exists but role is not yet fetched (still loading from Firestore)
  // Show spinner while fetching role
  if (loading) {
    console.log("ProtectedRoute: User exists but role loading:", loading);
    return <LoadingSpinner />;
  }

  // Role check - redirect to appropriate dashboard if role doesn't match
  if (requiredRole && userRole !== requiredRole) {
    console.log("ProtectedRoute: Role mismatch. Required:", requiredRole, "User role:", userRole);
    
    // If user is admin, go to admin dashboard
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // If user has no role or any other role, go to student dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is authorized, render the protected content
  console.log("ProtectedRoute: Access granted, rendering children");
  return children;
}

