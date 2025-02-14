import PasswordStrengthMeter from "@/components/others/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "@/utils/validation";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
      if (ResetPasswordForm(formData, setErrors)) {
        console.log("Form submitted successfully", formData);
      } else {
        console.log("Form has errors", errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 p-6 flex-col">
      <div className="p-2 flex justify-center items-center flex-col ">
        <h2 className="text-3xl font-bold mb-5 text-center ">
          Reset Your Password
        </h2>
        <p className="text-lg text-gray-400 text-center">
          Enter your new password to complete the password reset process.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-6"
        >
          <div className=" mt-10 max-w-xl ">
            <label htmlFor="newPassword" className={`text-lg font-medium `}>
              New Password
            </label>
            <input
              type="text"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent 
                  ${
                    submitted && errors.newPassword
                      ? "border-red-500"
                      : "border-gray-100"
                  }
                `}
              placeholder="Enter your new password"
            />
            {submitted && errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>
          <PasswordStrengthMeter password={formData.newPassword} />
          <Button
            type="submit"
            className={`w-full h-12 px-12 py-3 text-white font-medium rounded-xl bg-primary hover:bg-primary-dark shadow-sm transition duration-300 ease-in-out `}
          >
            Reset Password{" "}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-5">
          {` By clicking "Reset Password," you agree to the`}{" "}
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

export default ResetPasswordPage;
