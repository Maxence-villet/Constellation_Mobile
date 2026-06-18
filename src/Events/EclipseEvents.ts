// src/Events/EclipseEvents.ts
import mitt from "mitt";
import { Eclipse } from "../Models/Eclipse";

type Events = {
  ECLIPSE_CREATED: Eclipse;
};

export const eclipseEmitter = mitt<Events>();

export enum EclipseEvents {
  ECLIPSE_CREATED = "ECLIPSE_CREATED",
}
