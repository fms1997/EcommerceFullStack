import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5138";
export const apiClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
// });
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const raw = window.localStorage.getItem("ecommerce_auth_session");
  if (!raw) {
    return config;
  }

  try {
    const session = JSON.parse(raw) as { token?: string };
    if (session.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch {
    window.localStorage.removeItem("ecommerce_auth_session");
  }

  return config;
});