// src/Actions/ToggleTodoAction.ts
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo } from "../Models/Todo";

export class ToggleTodoAction {
  execute(todo: Todo): Todo {
    const toggled = todo.toggle();
    emitter.emit(TodoEvents.TODO_TOGGLED, toggled);
    return toggled;
  }
}
