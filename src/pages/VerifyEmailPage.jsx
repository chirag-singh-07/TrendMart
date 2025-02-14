import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inuptRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((d) => d !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;

      inuptRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inuptRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // setCode((prev) => [...prev.slice(0, index - 1), "",...prev.slice(index)]);
      inuptRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log("Code", verificationCode);
    
  };

  // auto submit when all fields are filled
  useEffect(() => {
    if (code.every((d) => d !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className=" w-full overflow-hidden flex items-center justify-center">
      <div className="p-8 w-full flex flex-col items-center text-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-gray-900">Verify your email</h1>
        <p className="text-lg text-gray-600">
          Enter the 6-digit code sent to your email to complete your
          registration.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-6">
            {code.map((d, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inuptRefs.current[index] = el)}
                maxLength={6}
                value={d}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center border text-semibold border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  index === code.length - 1 && "border-blue-500"
                }`}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            // onClick={() => navigate("/dashboard")}
            disabled={code.every((d) => d === "")}
          >
            Verify Email
          </Button>
        </form>

        <p className="text-lg text-gray-600">
          {`If you haven't received the code, please check your spam folder or
          contact our support team.`}
        </p>
        <p className="text-lg text-gray-600">
          Return to{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
