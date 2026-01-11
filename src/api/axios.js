import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000"
});

// 🔐 Attach token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle expired / invalid token
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
