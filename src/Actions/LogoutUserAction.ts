// src/Actions/LogoutUserAction.ts

import { authEmitter } from "../Events/AuthEvents";
import { clearUserData } from "../utils/storage";

export class LogoutUserAction {
  async execute(): Promise<void> {
    await clearUserData();
    authEmitter.emit("LOGOUT");
  }
}
