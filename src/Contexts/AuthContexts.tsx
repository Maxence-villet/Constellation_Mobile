// src/Contexts/AuthContexts.tsx
import React, { createContext, useContext } from "react";
import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { RegisterUserDTO } from "../DTOs/RegisterUserDTO";
import { useAuthController } from "../Http/Controllers/useAuthController";
import { User } from "../Models/User";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (dto: LoginUserDTO) => Promise<void>;
  logout: () => void;
  register: (dto: RegisterUserDTO) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, login, logout, register } = useAuthController();

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
