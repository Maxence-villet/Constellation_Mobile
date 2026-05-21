// src/Events/AuthEvents.ts

import mitt from "mitt";
import { User } from "../Models/User";

type AuthEventsMap = {
  LOGGIN_SUCCESS: User;
  LOGOUT: void;
};

export const authEmitter = mitt<AuthEventsMap>();

export enum AuthEvents {
  LOGGIN_SUCCESS = "LOGGIN_SUCCESS",
  LOGOUT = "LOGOUT",
}
