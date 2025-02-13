import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProfilePage from "./pages/ProfilePage";
import Wishlish from "./pages/Wishlish";
import OrdersPage from "./pages/OrdersPage";
import CollectionPage from "./pages/CollectionPage";
import PageLayout from "./layout/pageLayout";
import AuthGuard from "./routes/AuthGuard";
import GuestGuard from "./routes/GuestGuard";
import AuthLayout from "./layout/AuthLayout";

const App = () => {
  // const isLogged = true;

  return (
    <Routes>
      {/* Public Routes (Accessible to Everyone) */}
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      {/* Protected Routes (Require Authentication) */}
      <Route element={<AuthGuard />}>
        <Route path="/" element={<PageLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<Wishlish />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="collections" element={<CollectionPage />} />
        </Route>
      </Route>

      {/* Guest Routes (Only for Unauthenticated Users) */}
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>
      </Route>

      {/* Catch-All Route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
