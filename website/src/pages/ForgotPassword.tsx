import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep(2);
      toast.success("OTP sent to your email");
    } catch (err: any) {
      // Prompt says: always show "OTP sent" and move to Step 2 regardless of API response
      setStep(2);
      toast.success("OTP sent to your email");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }

    try {
      await resetPassword(otpString, newPassword, navigate);
      toast.success("Password reset successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed. Check OTP.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-[420px] space-y-10">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className={`h-1 w-8 rounded-full ${step >= 1 ? "bg-black" : "bg-zinc-100"}`}
            />
            <span
              className={`h-1 w-8 rounded-full ${step >= 2 ? "bg-black" : "bg-zinc-100"}`}
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
            Security Recovery // Step 0{step}
          </p>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic">
            {step === 1 ? (
              <>
                Reset{" "}
                <span className="underline decoration-1 underline-offset-8">
                  Key
                </span>
              </>
            ) : (
              <>
                New{" "}
                <span className="underline decoration-1 underline-offset-8">
                  Access
                </span>
              </>
            )}
          </h2>
        </div>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider opacity-60">
                Email for Recovery
              </Label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <Input
                  type="email"
                  placeholder="EX: ACCOUNT@DOMAIN.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold uppercase"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  SEND CODE <ArrowRight size={14} />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-wider opacity-60">
                Security Code
              </Label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-lg font-black border-2 border-[#e0e0e0] rounded-xl focus:border-black transition-all bg-white"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider opacity-60">
                New Password
              </Label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="NEW PASSWORD"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider opacity-60">
                Confirm Password
              </Label>
              <div className="relative group">
                <ShieldCheck
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="CONFIRM NEW"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-[#e0e0e0] focus-visible:ring-black text-xs font-bold"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6 || !newPassword}
              className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  UPDATE PASSWORD <ShieldCheck size={14} />
                </>
              )}
            </Button>
          </form>
        )}

        <div className="text-center pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={14} /> Nevermind, I remember
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
