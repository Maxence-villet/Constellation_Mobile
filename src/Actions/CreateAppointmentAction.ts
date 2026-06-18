// src/Actions/CreateAppointmentAction.ts
import { CreateAppointmentDTO } from "../DTOs/CreateAppointmentDTO";
import {
  appointmentEmitter,
  AppointmentEvents,
} from "../Events/AppointmentEvents";
import { Appointment, AppointmentAttributes } from "../Models/Appointment";
import { http } from "../utils/http";

export class CreateAppointmentAction {
  async execute(dto: CreateAppointmentDTO): Promise<Appointment> {
    const data = await http.post<AppointmentAttributes>(
      dto,
      "appointments",
      true,
    );
    const appointment = new Appointment(data);
    appointmentEmitter.emit(AppointmentEvents.APPOINTMENT_CREATED, appointment);
    return appointment;
  }
}
