// src/Actions/FetchMemberAppointmentsAction.ts
// Charge les rendez-vous assignés à un membre spécifique
import { Appointment, AppointmentAttributes } from "../Models/Appointment";
import { http } from "../utils/http";

export class FetchMemberAppointmentsAction {
  async execute(memberId: string): Promise<Appointment[]> {
    const data = await http.get<AppointmentAttributes[]>(
      `appointments?assigned_to_member_id=${memberId}`,
      true,
    );
    return data.map((item) => new Appointment(item));
  }
}
