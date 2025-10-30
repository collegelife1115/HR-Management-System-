import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
});

// This is the interceptor. It runs BEFORE every request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add it to the header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
