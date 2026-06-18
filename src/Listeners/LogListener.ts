// src/Listeners/LogListener.ts
import { authEmitter, AuthEvents } from "../Events/AuthEvents";
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

    authEmitter.on(AuthEvents.LOGIN_SUCCESS, (user) => {
      console.log(`[LogListener] User logged: ${user.email}`);
    });

    authEmitter.on(AuthEvents.LOGOUT, () => {
      console.log("[LogListener] User logged out");
    });
  }
}
