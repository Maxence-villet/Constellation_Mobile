// src/Actions/FetchTodosAction.ts
import { Todo } from "../Models/Todo";
import { getUserData } from "../utils/storage";

export class FetchTodosAction {
  async execute(): Promise<Todo[]> {
    const user = await getUserData();
    if (!user?.token) throw new Error("Non authentifié");

    const response = await fetch("https://localhost:3000/api/todos", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) throw new Error("Impossible de charger les tâches");

    const data = await response.json();
    return data.map((item: any) => new Todo(item));
  }
}
