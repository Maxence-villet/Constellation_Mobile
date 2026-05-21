// src/Http/Controllers/useAuthController.ts
import { LoginUserAction } from "@/src/Actions/LoginUserAction";
import { LogoutUserAction } from "@/src/Actions/LogoutUserAction";
import { LoginUserDTO } from "@/src/DTOs/LoginUserDTO";
import { authEmitter, AuthEvents } from "@/src/Events/AuthEvents";
import { User } from "@/src/Models/User";
import { getUserData } from "@/src/utils/storage";
import { useEffect, useState } from "react";

export function useAuthController() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await getUserData();
      if (stored) {
        setUser(stored);
      }
      setIsLoading(false);
    };
    loadUser();

    authEmitter.on(AuthEvents.LOGGIN_SUCCESS, (loggedUser) =>
      setUser(loggedUser),
    );
    authEmitter.on(AuthEvents.LOGOUT, () => setUser(null));

    return () => {
      authEmitter.off(AuthEvents.LOGGIN_SUCCESS);
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

  return { user, isLoading, login, logout };
}
