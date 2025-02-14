import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AuthGuard = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
