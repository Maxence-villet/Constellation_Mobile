// src/Events/AuthEvents.ts

import mitt from "mitt";

type AuthEventsMap = {
  LOGIN_SUCCESS: { token: string };
  LOGOUT: void;
};

export const authEmitter = mitt<AuthEventsMap>();

export enum AuthEvents {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGOUT = "LOGOUT",
}
