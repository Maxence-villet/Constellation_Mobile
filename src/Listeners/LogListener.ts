// src/Listeners/LogListener.ts
import { authEmitter, AuthEvents } from "../Events/AuthEvents";
import {
  appointmentEmitter,
  AppointmentEvents,
} from "../Events/AppointmentEvents";
import { eclipseEmitter, EclipseEvents } from "../Events/EclipseEvents";
import { emitter, TodoEvents } from "../Events/TodoEvents";

export class LogListener {
  register(): void {
    emitter.on(TodoEvents.TODO_ADDED, (todo) => {
      console.log(`[LogListener] Todo added: ${todo.title}`);
    });

    emitter.on(TodoEvents.TODO_TOGGLED, (todo) => {
      console.log(
        `[LogListener] Todo toggled: ${todo.title} → ${todo.completed}`,
      );
    });

    emitter.on(TodoEvents.TODO_DELETED, (todo) => {
      console.log(`[LogListener] Todo deleted: ${todo.title}`);
    });

    emitter.on(TodoEvents.TODO_ASSIGNED, (todo) => {
      console.log(
        `[LogListener] Todo assigned: ${todo.title} → member ${todo.assigned_to}`,
      );
    });

    eclipseEmitter.on(EclipseEvents.ECLIPSE_CREATED, (eclipse) => {
      console.log(
        `[LogListener] Eclipse created: ${eclipse.todoTitle}` +
          ` (${eclipse.fromMemberId} → ${eclipse.toMemberId})`,
      );
    });

    appointmentEmitter.on(AppointmentEvents.APPOINTMENT_CREATED, (a) => {
      console.log(`[LogListener] Appointment created: ${a.title} @ ${a.date}`);
    });

    appointmentEmitter.on(AppointmentEvents.APPOINTMENT_UPDATED, (a) => {
      console.log(`[LogListener] Appointment updated: ${a.title}`);
    });

    appointmentEmitter.on(AppointmentEvents.APPOINTMENT_DELETED, (a) => {
      console.log(`[LogListener] Appointment deleted: ${a.title}`);
    });

    authEmitter.on(AuthEvents.LOGIN_SUCCESS, (user) => {
      console.log(`[LogListener] User logged: ${user.email}`);
    });

    authEmitter.on(AuthEvents.LOGOUT, () => {
      console.log("[LogListener] User logged out");
    });
  }
}
