// src/Actions/LoginUserAction.ts

import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { authEmitter, AuthEvents } from "../Events/AuthEvents";
import { http } from "../utils/http";
import { storeAccessToken } from "../utils/storage";

export class LoginUserAction {
  async execute(dto: LoginUserDTO) {
    const data = await http.postForm<{
      access_token: string;
      token_type: string;
    }>(
      {
        username: dto.username,
        password: dto.password,
      },
      "auth/login",
    );

    const token = `Bearer ${data.access_token}`;
    await storeAccessToken(token);
    authEmitter.emit(AuthEvents.LOGIN_SUCCESS, { token });
    return { token };
  }
}
