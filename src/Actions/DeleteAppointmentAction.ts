// src/Actions/DeleteAppointmentAction.ts
import {
  appointmentEmitter,
  AppointmentEvents,
} from "../Events/AppointmentEvents";
import { Appointment } from "../Models/Appointment";
import { http } from "../utils/http";

export class DeleteAppointmentAction {
  async execute(appointment: Appointment): Promise<void> {
    await http.delete(`appointments/${appointment.id}`, true);
    appointmentEmitter.emit(
      AppointmentEvents.APPOINTMENT_DELETED,
      appointment,
    );
  }
}
