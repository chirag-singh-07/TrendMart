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
import PageLayout from "./layout/PageLayout";
import AuthGuard from "./routes/AuthGuard";
import GuestGuard from "./routes/GuestGuard";
import AuthLayout from "./layout/AuthLayout";
import TermsAndServicePage from "./pages/TermsAndServicePage";
import PrivacyAndPolicy from "./pages/PrivacyAndPolicy";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import DataProtectionPolicyPage from "./pages/DataProtectionPolicyPage";
import DetailLayout from "./layout/DetailLayout";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import ForgotPasswordSentPage from "./pages/ForgotPasswordSentPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { Loader2 } from "lucide-react";

const App = () => {
  // const isLogged = true;
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    // return <LoadingSpinComponent/>;
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (Accessible to Everyone) */}
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Protected Routes (Require Authentication) */}
      <Route element={<AuthGuard />}>
        <Route path="/" element={<PageLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<Wishlish />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="collections" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
        </Route>
      </Route>

      {/* Guest Routes (Only for Unauthenticated Users) */}
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/forgot-password-sent"
            element={<ForgotPasswordSentPage />}
          />
        </Route>
      </Route>

      {/* Email Verification (Accessible to authenticated but unverified users) */}
      <Route element={<AuthLayout />}>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Public Pages (Accessible to Everyone) */}
      <Route element={<DetailLayout />}>
        <Route path="/terms-of-service" element={<TermsAndServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyAndPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="/data-protection-policy"
          element={<DataProtectionPolicyPage />}
        />
      </Route>

      {/* Catch-All Route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
