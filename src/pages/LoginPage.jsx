import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { LoginValidateForm } from "@/utils/validation";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Remove error message when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (LoginValidateForm(formData, setErrors)) {
      console.log("Form submitted successfully", formData);
      await login(formData, toast, navigate);
    } else {
      console.log("Form validation failed", errors);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 bg-white">
      <div className=" flex flex-col items-center justify-center gap-4 overflow-hidden">
        <div>
          <h1 className="text-5xl font-bold text-center mt-8">Welcome Back!</h1>
          <p className="text-lg mt-4 text-center tracking-tighter text-gray-500 mb-10">
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className={`text-lg font-medium `}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border-2 rounded-xl p-3 mt-1 bg-transparent 
                  ${
                    submitted && errors.email
                      ? "border-red-500"
                      : "border-gray-400"
                  }
                `}
                placeholder="Enter your email"
              />
              {submitted && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className={`text-lg font-medium `}>
                Password
              </label>
              <input
                type={showPassword ? "password" : "text"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border-2 rounded-xl p-3 mt-1 bg-transparent 
                  ${
                    submitted && errors.password
                      ? "border-red-500"
                      : "border-gray-400"
                  }
                `}
                placeholder="Enter your password"
              />
              <div className="absolute p-1 right-4 top-10">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-400 hover:text-gray-500"
                  onClick={handleShowPasswordToggle}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
              </div>
              {submitted && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-6 text-lg mt-5">
              <div>
                <Link to={"/forgot-password"} className="text-purple-500">
                  Forgot Password?
                </Link>
              </div>
              <p>
                {`Don't have an account?`}{" "}
                <Link
                  to={"/register"}
                  className="text-purple-500 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-y-6 ">
              <Button
                type="submit"
                className="text-lg font-bold py-6 active:scale-[.98] active:duration-75 transition-all "
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="text-lg font-bold py-6 active:scale-[.98] active:duration-75 transition-all "
              >
                <img src="/google.svg" alt="google logo" className="size-6" />
                Sign In with google
              </Button>
            </div>
            <div className="text-center mt-8">
              <p>
                {`By continuing, you agree to our `}
                <Link
                  to={"/terms-of-service"}
                  className="text-purple-500 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to={"/privacy-policy"}
                  className="text-purple-500 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
