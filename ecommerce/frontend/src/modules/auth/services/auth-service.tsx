import { apiClient } from "@/lib/api/api-client";
import { AuthResponse } from "@/modules/auth/types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", { email, password });
  return response.data;
}

export async function register(fullName: string, email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/register", {
    fullName,
    email,
    password,
  });
  return response.data;
}
