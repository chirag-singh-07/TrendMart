import Footer from "@/components/others/Footer";
import Header from "@/components/others/Header";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default PageLayout;
