// Http/Controllers/useAuthController.ts
import { FetchCurrentUserAction } from "@/src/Actions/FetchCurrentUserAction";
import { LoginUserAction } from "@/src/Actions/LoginUserAction";
import { LogoutUserAction } from "@/src/Actions/LogoutUserAction";
import { RegisterUserAction } from "@/src/Actions/RegisterUserAction";
import { LoginUserDTO } from "@/src/DTOs/LoginUserDTO";
import { RegisterUserDTO } from "@/src/DTOs/RegisterUserDTO";
import { authEmitter, AuthEvents } from "@/src/Events/AuthEvents";
import { User } from "@/src/Models/User";
import { clearUserData, getUserData, storeUserData } from "@/src/utils/storage";
import { useEffect, useState } from "react";

export function useAuthController() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await getUserData();
      if (stored) setUser(stored);
      setIsLoading(false);
    };
    loadUser();

    const handleLoginSuccess = async ({ token }: { token: string }) => {
      try {
        const fetchAction = new FetchCurrentUserAction();
        const userData = await fetchAction.execute();
        if (userData && userData.id) {
          await storeUserData(userData);
          setUser(userData);
        } else {
          await clearUserData();
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur récupération utilisateur", error);
        await clearUserData();
        setUser(null);
      }
    };

    authEmitter.on(AuthEvents.LOGIN_SUCCESS, handleLoginSuccess);
    authEmitter.on(AuthEvents.LOGOUT, () => {
      clearUserData();
      setUser(null);
    });

    return () => {
      authEmitter.off(AuthEvents.LOGIN_SUCCESS, handleLoginSuccess);
      authEmitter.off(AuthEvents.LOGOUT);
    };
  }, []);

  const login = async (dto: LoginUserDTO) => {
    const action = new LoginUserAction();
    await action.execute(dto);
  };

  const logout = () => {
    const action = new LogoutUserAction();
    action.execute();
  };

  const register = async (dto: RegisterUserDTO) => {
    const action = new RegisterUserAction();
    await action.execute(dto);
  };

  return { user, isLoading, login, logout, register };
}
