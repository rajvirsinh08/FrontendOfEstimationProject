import axios from "axios";
import { store } from "./Store/store";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL, // 👈 ensures /api prefix is included
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
