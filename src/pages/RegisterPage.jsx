import { Button } from "@/components/ui/button";
import { RegisterValidateForm } from "@/utils/validation";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
// import { UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (RegisterValidateForm(formData, setErrors)) {
      console.log("Form submitted successfully", formData);
    } else {
      // console.log("Form has errors", errors);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 bg-white">
      <div className=" flex flex-col items-center justify-center gap-4 overflow-hidden">
        <div className="">
          <h1 className="text-5xl font-semibold mb-5 text-center mt-8  ">
            Join TrendMart Today!
          </h1>
          <p className="text-center text-medium tracking-tighter mb-10 text-gray-500">
            {" "}
            Unlock exclusive offers, stay updated on the latest trends, and
            enjoy a seamless shopping experience. Register now and be part of
            our vibrant community!
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="mb-4">
              <label htmlFor="fullName" className={`text-lg font-medium `}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full border-2 rounded-xl p-3 mt-1 bg-transparent 
                  ${
                    submitted && errors.fullName
                      ? "border-red-500"
                      : "border-gray-100"
                  }
                `}
                placeholder="Enter your full name"
              />
              {submitted && errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>
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
                      : "border-gray-100"
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
                      : "border-gray-100"
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
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="ml-2">
                  Remember me for 7 days
                </label>
              </div>
              <p>
                Already have an account?{" "}
                <Link to={"/login"} className="text-purple-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-y-4">
              <Button
                type="submit"
                className="text-lg font-bold py-6 active:scale-[.98] active:duration-75 transition-all "
              >
                Create Account
              </Button>
              <Button
                variant="outline"
                className="text-lg font-bold py-6 active:scale-[.98] active:duration-75 transition-all "
              >
                <img src="/google.svg" alt="google logo" className="size-6" />
                Sign up with google
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              {`By clicking "Create Account", you agree to our Terms of Service
               and Privacy Policy. For more information, please visit our`}{" "}
              <Link
                to={"/terms-of-service"}
                className="text-purple-500 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to={"/privacy-policy"}
                className="text-purple-500 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and our{" "}
              <Link
                to={"/cookie-policy"}
                className="text-purple-500 hover:underline"
              >
                Cookie Policy
              </Link>{" "}
              and our{" "}
              <Link
                to={"/data-protection-policy"}
                className="text-purple-500 hover:underline"
              >
                Data Protection Policy
              </Link>{" "}
              before using our website.{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
