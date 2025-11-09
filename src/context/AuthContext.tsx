import React, { useState, createContext } from "react";
import { UserState } from "../types";

type AuthContextType = [
  UserState,
  React.Dispatch<React.SetStateAction<UserState>>
];

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const defaultUser: UserState = {
  loggedIn: false,
  role: null,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserState>(defaultUser);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};
