import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

const ForgotPasswordSentPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <MailCheck size={64} className="text-green-500 mb-4" />
      
      <h1 className="text-2xl font-semibold mb-2">Check Your Email</h1>
      <p className="text-gray-600 mb-4">
        We have sent a password reset link to your email. Please check your
        inbox and follow the instructions.
      </p>
      <Link to="/login">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Login
        </button>
      </Link>
    </div>
  );
};

export default ForgotPasswordSentPage;
