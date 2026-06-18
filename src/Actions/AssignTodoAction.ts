// src/Actions/AssignTodoAction.ts
import { AssignTodoDTO } from "../DTOs/AssignTodoDTO";
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo, TodoAttributes } from "../Models/Todo";
import { http } from "../utils/http";

export class AssignTodoAction {
  async execute(dto: AssignTodoDTO): Promise<Todo> {
    const data = await http.post<TodoAttributes>(
      { member_id: dto.memberId },
      `todos/${dto.todoId}/assign`,
      true,
    );
    const updatedTodo = new Todo(data);
    emitter.emit(TodoEvents.TODO_ASSIGNED, updatedTodo);
    return updatedTodo;
  }
}
