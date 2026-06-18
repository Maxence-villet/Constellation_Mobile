// src/Http/Controllers/useAppointmentController.ts
import { useState } from "react";
import { CreateAppointmentAction } from "../../Actions/CreateAppointmentAction";
import { DeleteAppointmentAction } from "../../Actions/DeleteAppointmentAction";
import { FetchAppointmentsAction } from "../../Actions/FetchAppointmentsAction";
import { UpdateAppointmentAction } from "../../Actions/UpdateAppointmentAction";
import { CreateAppointmentDTO } from "../../DTOs/CreateAppointmentDTO";
import { UpdateAppointmentDTO } from "../../DTOs/UpdateAppointmentDTO";
import { Appointment } from "../../Models/Appointment";

export function useAppointmentController() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async (constellationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const action = new FetchAppointmentsAction();
      const data = await action.execute(constellationId);
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (dto: CreateAppointmentDTO): Promise<void> => {
    const action = new CreateAppointmentAction();
    const newAppointment = await action.execute(dto);
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const update = async (dto: UpdateAppointmentDTO): Promise<void> => {
    const action = new UpdateAppointmentAction();
    const updated = await action.execute(dto);
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
  };

  const remove = async (appointment: Appointment): Promise<void> => {
    const action = new DeleteAppointmentAction();
    await action.execute(appointment);
    setAppointments((prev) => prev.filter((a) => a.id !== appointment.id));
  };

  return { appointments, isLoading, load, create, update, remove };
}
