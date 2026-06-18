// src/Actions/DeleteTodoAction.ts
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo } from "../Models/Todo";
import { http } from "../utils/http";

export class DeleteTodoAction {
  async execute(todo: Todo): Promise<void> {
    await http.delete(`todos/${todo.id}`);
    emitter.emit(TodoEvents.TODO_DELETED, todo);
  }
}
