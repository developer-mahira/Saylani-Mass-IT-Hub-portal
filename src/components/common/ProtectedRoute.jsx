import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  const normalizedRole =
    typeof userRole === "string" ? userRole.trim().toLowerCase() : "";

  if (loading && !initialized) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading && !normalizedRole) {
    return <LoadingSpinner />;
  }

  if (!normalizedRole) {
    return <LoadingSpinner />;
  }

  if (requiredRole && normalizedRole !== requiredRole) {
    if (normalizedRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
