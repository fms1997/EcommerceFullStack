import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5138";
export const apiClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});