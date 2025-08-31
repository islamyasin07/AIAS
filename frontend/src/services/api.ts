import axios from "axios";
import { getToken } from "./authService";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");
export const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
