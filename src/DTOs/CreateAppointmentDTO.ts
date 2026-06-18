// src/DTOs/CreateAppointmentDTO.ts
import { ReminderAttributes } from "../Models/Appointment";

export interface CreateAppointmentDTO {
  title: string;
  description?: string;
  date: string; // ISO 8601
  constellationId: string;
  reminders: ReminderAttributes[];
  assigned_to_member_id?: string | null; // optionnel : attribuer à un autre membre
}
