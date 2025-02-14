import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const GuestGuard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  const allowedPaths = ["/forgot-password", "/reset-password"];

  // Allow access to forgot/reset password even if logged in
  if (allowedPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  // If authenticated but NOT verified, redirect to verify email page
  if (isAuthenticated && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If authenticated and verified, redirect to home
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestGuard;
