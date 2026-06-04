// src/Actions/FetchTodosAction.ts
import { Todo, TodoAttributes } from "../Models/Todo";
import { http } from "../utils/http";

export class FetchTodosAction {
  async execute(): Promise<Todo[]> {
    const data = await http.get<TodoAttributes[]>("/todos");
    return data.map((item) => new Todo(item));
  }
}
