// src/Actions/SubmitTodoAction.ts
// L'assigné marque la tâche comme terminée → statut "pending" (en attente de validation)
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo, TodoAttributes } from "../Models/Todo";
import { http } from "../utils/http";

export class SubmitTodoAction {
  async execute(todo: Todo): Promise<Todo> {
    const data = await http.post<TodoAttributes>(
      {},
      `todos/${todo.id}/submit`,
      true,
    );
    const submitted = new Todo(data);
    emitter.emit(TodoEvents.TODO_SUBMITTED, submitted);
    return submitted;
  }
}
