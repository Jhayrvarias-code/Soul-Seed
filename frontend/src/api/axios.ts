import axios from "axios";
import { getApiBaseUrl } from "@/config/api";

export const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(import.meta.env.VITE_REACT_APP_API_URL);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
