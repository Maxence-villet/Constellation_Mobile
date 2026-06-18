// src/Actions/UpdateAppointmentAction.ts
import { UpdateAppointmentDTO } from "../DTOs/UpdateAppointmentDTO";
import {
  appointmentEmitter,
  AppointmentEvents,
} from "../Events/AppointmentEvents";
import { Appointment, AppointmentAttributes } from "../Models/Appointment";
import { http } from "../utils/http";

export class UpdateAppointmentAction {
  async execute(dto: UpdateAppointmentDTO): Promise<Appointment> {
    const { id, ...body } = dto;
    const data = await http.patch<AppointmentAttributes>(
      body,
      `appointments/${id}`,
      true,
    );
    const appointment = new Appointment(data);
    appointmentEmitter.emit(AppointmentEvents.APPOINTMENT_UPDATED, appointment);
    return appointment;
  }
}
