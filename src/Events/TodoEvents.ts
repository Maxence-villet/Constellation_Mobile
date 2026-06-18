// src/Events/TodoEvents.ts
import mitt from "mitt";
import { Todo } from "../Models/Todo";

type Events = {
  TODO_ADDED: Todo;
  TODO_TOGGLED: Todo;
  TODO_DELETED: Todo;
  TODO_ASSIGNED: Todo;
  APP_READY: boolean;
};

export const emitter = mitt<Events>();

export enum TodoEvents {
  TODO_ADDED = "TODO_ADDED",
  TODO_TOGGLED = "TODO_TOGGLED",
  TODO_DELETED = "TODO_DELETED",
  TODO_ASSIGNED = "TODO_ASSIGNED",
  APP_READY = "APP_READY",
}
