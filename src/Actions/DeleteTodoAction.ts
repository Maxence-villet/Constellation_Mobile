// src/Actions/DeleteTodoAction.ts
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo } from "../Models/Todo";

export class DeleteTodoAction {
  execute(todo: Todo): void {
    emitter.emit(TodoEvents.TODO_DELETED, todo);
  }
}
