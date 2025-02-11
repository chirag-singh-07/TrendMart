import { isLoggind } from "@/constants";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  //   const isAuthenticated = useAuth();
  return isLoggind ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
