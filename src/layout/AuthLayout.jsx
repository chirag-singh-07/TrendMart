import { Link, Outlet } from "react-router-dom";
import image from "../../public/1.jpg";
import AuthNavbar from "@/pages/AuthNavbar";
import AuthFooter from "@/pages/AuthFooter";

const AuthLayout = () => {
  return (
    <>
      <AuthNavbar/>
      <main className="flex h-screen w-full">
        {/* <div className="w-full bg-white mx-auto flex items-center justify-center rounded-3xl shadow-xl"> */}
        {/* Left Side - Image (Hidden on md and smaller screens) */}
        <div className="hidden md:flex w-1/2 h-full relative items-center justify-center">
          {/* Background Image */}
          <img
            src={image}
            alt="Auth Banner"
            className="w-full h-full object-cover "
          />

          {/* Overlay with Blur and Branding */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white px-6 text-center">
            <div className="backdrop-blur-md p-6 rounded-lg">
              <h1 className="text-3xl font-bold mb-8">
                Welcome to <Link to={"/"}>TrendMart</Link>
              </h1>
              <p className="text-lg">
                {`        Welcome to TrendMart – Your One-Stop Fashion Destination! Explore
                a world of stylish clothing, latest fashion trends, and exclusive
                 deals. Whether you're looking for everyday essentials or statement
                 pieces, we bring you high-quality products at unbeatable prices.
               Enjoy a seamless shopping experience with secure payments, fast
               delivery, and excellent customer support. TrendMart – Where
                 Fashion Meets Convenience!`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Form (Full Width on Small Screens) */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md p-6">
            <Outlet />
          </div>
        </div>
        {/* </div> */}
      </main>
      <AuthFooter/>
    </>
  );
};

export default AuthLayout;
