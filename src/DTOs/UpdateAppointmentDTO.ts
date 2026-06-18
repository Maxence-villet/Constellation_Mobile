// src/DTOs/UpdateAppointmentDTO.ts
import { ReminderAttributes } from "../Models/Appointment";

export interface UpdateAppointmentDTO {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  reminders?: ReminderAttributes[];
}
