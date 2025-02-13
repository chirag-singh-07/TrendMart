const AuthFooter = () => {
  return (
    <div className="flex items-center justify-center w-full p-4 bg-black text-white shadow-md">
        <p>&copy; TrendMart {new Date().getFullYear()} | All rights reserved.</p>
    </div>
  );
};

export default AuthFooter;
