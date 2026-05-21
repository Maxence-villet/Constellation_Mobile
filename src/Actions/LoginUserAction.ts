// src/Actions/LoginUserAction.ts

import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { authEmitter } from "../Events/AuthEvents";
import { User } from "../Models/User";
import { storeUserData } from "../utils/storage";

export class LoginUserAction {
  async execute(dto: LoginUserDTO) {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    const data = await response.json();

    const user = new User({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      token: data.token,
    });

    await storeUserData(user);
    authEmitter.emit("LOGGIN_SUCCESS", user);
    return user;
  }
}
