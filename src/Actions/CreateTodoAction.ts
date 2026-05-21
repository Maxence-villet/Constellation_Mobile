// src/Actions/CreateTodoAction.ts
import { CreateTodoDTO } from "../DTOs/CreateTodoDTO";
import { emitter, TodoEvents } from "../Events/TodoEvents";
import { Todo } from "../Models/Todo";

let idCounter = 0;

export class CreateTodoAction {
  execute(dto: CreateTodoDTO): Todo {
    idCounter++;
    const newTodo = new Todo({
      id: String(idCounter),
      title: dto.title.trim(),
      completed: false,
    });

    emitter.emit(TodoEvents.TODO_ADDED, newTodo);
    return newTodo;
  }
}
