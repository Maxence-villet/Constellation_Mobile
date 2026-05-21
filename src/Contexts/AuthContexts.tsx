// src/Contexts/AuthContexts.tsx
import React, { createContext, useContext } from "react";
import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { useAuthController } from "../Http/Controllers/useAuthController";
import { User } from "../Models/User";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (dto: LoginUserDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Le contrôleur contient toute la logique d’état et d’actions
  const { user, isLoading, login, logout } = useAuthController();

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
