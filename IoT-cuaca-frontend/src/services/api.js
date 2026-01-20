import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://dw3736vv-3000.asse.devtunnels.ms/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const attachToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Let caller decide how to handle (e.g., logout)
    }
    return Promise.reject(error);
  },
);

export const loginRequest = (credentials) => api.post("/login", credentials);

export const fetchDashboardStats = () => api.get("/api/dashboard/stats");
