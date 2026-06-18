// src/Actions/FetchAppointmentsAction.ts
import { Appointment, AppointmentAttributes } from "../Models/Appointment";
import { http } from "../utils/http";

export class FetchAppointmentsAction {
  async execute(constellationId: string): Promise<Appointment[]> {
    const data = await http.get<AppointmentAttributes[]>(
      `appointments?constellation_id=${constellationId}`,
      true,
    );
    return data.map((item) => new Appointment(item));
  }
}
