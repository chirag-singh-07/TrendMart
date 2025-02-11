import { isLoggind } from "@/constants";
import Navbar from "./Navbar";

const Header = () => {
  const user = {
    fullName: "Johan",
    email: "johan@gmail.com",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
  };
  return (
    <header className="border-b shadow-md">
      <Navbar user={user} isLoggind={isLoggind} />
    </header>
  );
};

export default Header;
