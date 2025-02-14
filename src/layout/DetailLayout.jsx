import AuthFooter from "@/pages/AuthFooter";
import AuthNavbar from "@/pages/AuthNavbar";
import { Outlet } from "react-router-dom";

const DetailLayout = () => {
  return (
    <>
      <AuthNavbar />
      <main>
        <Outlet />
      </main>
      <AuthFooter />
    </>
  );
};

export default DetailLayout;
