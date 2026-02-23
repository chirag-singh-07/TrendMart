import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/AdminLayout";
import UsersList from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import Banners from "./pages/Banners";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("adminToken");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(!!token);
  }, [setIsAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
