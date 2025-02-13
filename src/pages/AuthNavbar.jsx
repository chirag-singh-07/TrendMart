import { Link } from "react-router-dom";

const AuthNavbar = () => {
  return (
    <div className="flex fixed z-20 items-center justify-center w-full p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">
        <Link to={"/"}>TrendMart</Link>
      </h1>
    </div>
  );
};

export default AuthNavbar;
