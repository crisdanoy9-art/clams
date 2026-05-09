// frontend/src/services/axios.js
import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
