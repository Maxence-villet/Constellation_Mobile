// src/Actions/ValidateTodoAction.ts
// Le donneur de tâche (assigned_by) ou le Sirius valide → statut "validated"
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo, TodoAttributes } from "../Models/Todo";
import { http } from "../utils/http";

export class ValidateTodoAction {
  async execute(todo: Todo): Promise<Todo> {
    const data = await http.post<TodoAttributes>(
      {},
      `todos/${todo.id}/validate`,
      true,
    );
    const validated = new Todo(data);
    emitter.emit(TodoEvents.TODO_VALIDATED, validated);
    return validated;
  }
}
