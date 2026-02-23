import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { verifyEmail, resendOtp, isLoading } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    try {
      await verifyEmail(otpString, navigate);
      toast.success("Email verified successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp("verify");
      setTimer(120);
      setCanResend(false);
      toast.success("OTP resent successfully");
    } catch (err: any) {
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-black">
      {/* Left Side: Editorial Style */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden bg-black text-white p-12 flex-col justify-between">
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
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] block opacity-50">
              Security // Protocol
            </span>
            <h2 className="text-5xl font-bold tracking-tight leading-none uppercase italic">
              Verify <br />
              <span className="not-italic underline decoration-1 underline-offset-8">
                Access
              </span>
            </h2>
          </div>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
            A 6-digit verification code has been dispatched to your registered
            email address to ensure account integrity.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[8px] uppercase font-black tracking-[0.4em] opacity-30">
          <span>Verification Portal</span>
          <span>© 2026 TrendMart</span>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px] space-y-12">
          <div className="lg:hidden text-center mb-12">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2 justify-center text-black"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg">
                T
              </div>
              TrendMart
            </Link>
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 lg:mx-0 mx-auto group-hover:scale-105 transition-transform duration-500 shadow-xl">
              <Mail className="text-white w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic">
              Secure{" "}
              <span className="underline decoration-1 underline-offset-8">
                Login
              </span>
            </h2>
            <p className="text-black/50 text-[10px] font-black uppercase tracking-widest leading-loose">
              We've sent a 6-digit recovery code to your inbox. <br /> Enter it
              below to proceed.
            </p>
          </div>

          <div className="space-y-10">
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-16 text-center text-xl font-black border-2 border-[#e0e0e0] rounded-xl focus:border-black focus:ring-0 transition-all bg-white shadow-sm"
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  VERIFY ACCOUNT <ArrowRight size={14} />
                </>
              )}
            </Button>

            <div className="space-y-4 text-center pt-4 border-t border-zinc-100 uppercase tracking-widest">
              <p className="text-[10px] font-bold opacity-40">
                {canResend
                  ? "Didn't receive the code?"
                  : `Resend available in ${formatTime(timer)}`}
              </p>
              {canResend && (
                <button
                  onClick={handleResend}
                  className="text-[10px] font-black underline decoration-black/20 underline-offset-4 hover:decoration-black transition-all"
                >
                  Resend Security Code
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity pt-4"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
