// src/Events/AppointmentEvents.ts
import mitt from "mitt";
import { Appointment } from "../Models/Appointment";

type Events = {
  APPOINTMENT_CREATED: Appointment;
  APPOINTMENT_UPDATED: Appointment;
  APPOINTMENT_DELETED: Appointment;
};

export const appointmentEmitter = mitt<Events>();

export enum AppointmentEvents {
  APPOINTMENT_CREATED = "APPOINTMENT_CREATED",
  APPOINTMENT_UPDATED = "APPOINTMENT_UPDATED",
  APPOINTMENT_DELETED = "APPOINTMENT_DELETED",
}
