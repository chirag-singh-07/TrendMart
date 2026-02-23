import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer" as "buyer",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;

  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8+ chars and contain uppercase, lowercase, and a digit";
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format (e.g. +919876543210)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setGeneralError(null);

    try {
      await register(formData, navigate);
      toast.success("Registration successful! Verify your email.");
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data.errors) {
        const fieldErrors: Record<string, string> = {};
        err.response.data.errors.forEach((e: any) => {
          fieldErrors[e.path] = e.msg;
        });
        setErrors(fieldErrors);
      } else if (err.response?.status === 409) {
        setGeneralError(
          err.response.data.message || "Email or phone already exists",
        );
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-black">
      <div className="hidden lg:flex lg:w-1/3 relative bg-black text-white p-12 flex-col justify-between overflow-hidden">
        <div className="relative z-10">
          <Link
            to="/"
            className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-black text-sm">
              T
            </div>
            TrendMart
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl font-bold tracking-tighter uppercase italic">
            Join the <br />
            Collective
          </h2>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
            Start your journey as a buyer. Access curated collections and
            exclusive member benefits.
          </p>
        </div>
        <div className="relative z-10 text-[8px] uppercase font-black tracking-[0.4em] opacity-30">
          Account Registration // Step 01
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[500px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter uppercase italic">
              Create{" "}
              <span className="underline decoration-1 underline-offset-4">
                Account
              </span>
            </h2>
            <p className="text-black/50 text-[9px] font-black uppercase tracking-widest">
              Minimalist e-commerce begins here
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {generalError && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 shrink-0" />
                <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  {generalError}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-wider opacity-60">
                  First Name
                </Label>
                <div className="relative group">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                    size={14}
                  />
                  <Input
                    placeholder="CHIRAG"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold uppercase tracking-wider"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[9px] text-red-600 font-bold uppercase">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-wider opacity-60">
                  Last Name
                </Label>
                <Input
                  placeholder="SINGH"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="h-12 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold uppercase tracking-wider"
                />
                {errors.lastName && (
                  <p className="text-[9px] text-red-600 font-bold uppercase">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-wider opacity-60">
                Contact Information
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                    size={14}
                  />
                  <Input
                    type="email"
                    placeholder="EMAIL@EXAMPLE.COM"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold uppercase tracking-wider"
                  />
                </div>
                <div className="relative group">
                  <Phone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                    size={14}
                  />
                  <Input
                    type="tel"
                    placeholder="+919876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="text-[9px] text-red-600 font-bold uppercase">
                  {errors.email}
                </p>
              )}
              {errors.phone && (
                <p className="text-[9px] text-red-600 font-bold uppercase">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-wider opacity-60">
                Security Access
              </Label>
              <div className="relative group">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                  size={14}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="CREATE PASSWORD"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10 h-12 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/20"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex gap-1 h-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= i ? "bg-black" : "bg-zinc-100"}`}
                  />
                ))}
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] mt-1 opacity-40">
                {passwordStrength === 0
                  ? "Empty"
                  : passwordStrength < 3
                    ? "Weak // Needs More Variety"
                    : passwordStrength === 3
                      ? "Medium // Secure"
                      : "Strong // Maximum Security"}
              </p>
              {errors.password && (
                <p className="text-[9px] text-red-600 font-bold uppercase">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  CREATE ACCOUNT <ArrowRight size={14} />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-[9px] font-bold uppercase tracking-widest pt-2 opacity-60">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-black font-black border-b border-black/20 hover:border-black transition-colors pb-0.5 ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
