import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { ForgotPasswordForm } from "@/utils/validation";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { forgotPasswordApi, isLoading } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    try {
      if (ForgotPasswordForm(formData, setErrors)) {
        // console.log("Form submitted successfully", formData);
        await forgotPasswordApi(formData, toast, navigate);
      } else {
        // console.log("Form has errors", errors);
        setSubmitted(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } catch (error) {
      console.log(error);
      setSubmitted(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.message,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 flex-col">
      <div className="p-2 flex justify-center items-center flex-col ">
        {/* <Key size={120} className="mb-10 animate-pulse"/> */}
        <KeyRound size={120} className="mb-10 animate-pulse" />
        <h2 className="text-3xl font-bold mb-5 text-center ">
          Forgot Your Password?
        </h2>
        <p className="text-lg text-gray-400 text-center">
          {`No worries! Just enter your registered email, and we’ll send you a link to reset your password. Check your inbox and follow the instructions to regain access to your account.`}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-6 w-full sm:px-20"
        >
          <div className="mt-10 w-full">
            <label htmlFor="newPassword" className={`text-lg font-medium `}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent 
              ${
                submitted && errors.email ? "border-red-500" : "border-gray-100"
              }
            `}
              placeholder="Enter your email"
            />
            {submitted && errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <Button
            type="submit"
            className={` text-lg w-full h-12 px-12 py-3 text-white font-medium rounded-xl bg-primary hover:bg-primary-dark shadow-sm transition duration-300 ease-in-out `}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Send Link"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-5">
          {`By clicking "Send Link," you agree to the`}{" "}
          <Link
            to="/terms-of-service"
            className="text-purple-500 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy-policy"
            className="text-purple-500 hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          and may receive emails about our newsletters and special offers.{" "}
          <Link to="/about" className="text-purple-500 hover:underline">
            Learn more about our privacy policy.
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
