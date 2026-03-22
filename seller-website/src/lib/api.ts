import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("seller_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor to handle 401s centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access detected. Revoking session...");
      localStorage.removeItem("seller_token");
      localStorage.removeItem("seller_data");

      // Force redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
