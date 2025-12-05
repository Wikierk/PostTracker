import client from "../api/client";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { UserState } from "../types";

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "admin" | "receptionist" | "employee";
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<UserState> => {
    const response = await client.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const { access_token, user } = response.data;

    await SecureStore.setItemAsync("auth_token", access_token);

    return {
      loggedIn: true,
      role: user.role,
      userId: user.id,
      token: access_token,
      email: user.email,
    };
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("auth_token");
  },

  checkAuth: async (): Promise<UserState | null> => {
    const token = await SecureStore.getItemAsync("auth_token");
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        await SecureStore.deleteItemAsync("auth_token");
        return null;
      }

      return {
        loggedIn: true,
        role: decoded.role,
        userId: decoded.sub,
        token: token,
        email: decoded.email,
      };
    } catch (error) {
      await SecureStore.deleteItemAsync("auth_token");
      return null;
    }
  },
};
