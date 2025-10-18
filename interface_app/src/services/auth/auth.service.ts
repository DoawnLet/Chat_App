import axiosConnected from "@/lib/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "./auth.types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosConnected.post(
      "/api/Authentication/login",
      data
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosConnected.post(
      "/api/Authentication/register",
      data
    );
    return response.data;
  },
};
