import React, { useState, useEffect, createContext } from "react";
import { UserState } from "../types";
import { authService } from "../services/authService";

type AuthContextType = {
  user: UserState;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const defaultUser: UserState = {
  loggedIn: false,
  role: null,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserState>(defaultUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const savedUser = await authService.checkAuth();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (e) {
        console.log("Błąd przywracania sesji", e);
      } finally {
        setIsLoading(false);
      }
    };
    restoreToken();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(email, pass);
      setUser(loggedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
