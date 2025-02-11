import { isLoggind } from "@/constants";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
  // const isAuthenticated = useAuth()
  return !isLoggind ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestGuard;
