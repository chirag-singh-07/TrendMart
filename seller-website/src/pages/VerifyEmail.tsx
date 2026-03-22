import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Loader2, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "../services/authService";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const userEmail = location.state?.email || "your email address";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
       navigate("/register");
    }
  }, [userId, navigate]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(data)) return;

    const newOtp = data.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
    // Auto submit call will be triggered by useEffect
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (otp.every(digit => digit !== "") && otp.length === 6) {
       handleSubmit();
    }
  }, [otp]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const otpCode = otp.join("");
      await authService.verifyEmail(userId, otpCode);
      // Success - redirect to login
      navigate("/login", { state: { verified: true } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
     setResending(true);
     setError("");
     try {
        await authService.resendOtp(userId, "verify");
        alert("A new verification code has been sent to " + userEmail);
     } catch (err: any) {
        setError(err?.response?.data?.message || "Could not resend code. Please try later.");
     } finally {
        setResending(false);
     }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-['Inter'] items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-12">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldCheck size={14} className="text-green-500" />
              Security Gateway
           </div>
           <h1 className="text-5xl font-black tracking-tighter uppercase italic text-zinc-900 leading-[0.9]">
             Authenticate Your <br />
             <span className="text-zinc-400 not-italic uppercase">Merchant Profile</span>
           </h1>
           <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed pt-2">
             We sent a 6-digit verification code to
             <br />
             <span className="text-black inline-flex items-center gap-1.5 mt-2 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                <Mail size={12} className="text-zinc-400" /> {userEmail}
             </span>
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 animate-in fade-in slide-in-from-top-2 text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3 md:gap-4 h-20 md:h-24">
            {otp.map((digit, i) => (
              <input
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="w-full max-w-[60px] md:max-w-[80px] h-full text-center text-2xl md:text-3xl font-black rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 focus:border-black focus:bg-white focus:outline-none transition-all shadow-sm focus:shadow-xl focus:shadow-black/5"
              />
            ))}
          </div>

          <div className="space-y-4">
            <Button
              disabled={loading || otp.some(d => d === "")}
              className="w-full h-18 rounded-2xl bg-black text-white hover:bg-black/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all font-black text-xs uppercase tracking-[0.2em] group flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Verify Identity"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </Button>

            <div className="flex items-center justify-between px-2">
               <button
                 type="button"
                 onClick={handleResend}
                 disabled={resending}
                 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center gap-2"
               >
                  {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  Resend Code
               </button>
               <Link
                to="/register"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
               >
                  Change Email
               </Link>
            </div>
          </div>
        </form>

        <div className="relative pt-8">
           <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-100"></span>
           </div>
           <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
              <span className="bg-white px-6 text-zinc-300">Enterprise Protocols</span>
           </div>
        </div>
      </div>
    </div>
  );
}
