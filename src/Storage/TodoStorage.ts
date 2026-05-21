// src/Storage/TodoStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo, TodoAttributes } from "../Models/Todo";

const TODOS_KEY = "@todos";

export class TodoStorage {
  async saveTodos(todos: Todo[]): Promise<void> {
    const serialized = JSON.stringify(todos.map((t) => t.toJSON()));
    await AsyncStorage.setItem(TODOS_KEY, serialized);
  }

  async loadTodos(): Promise<Todo[]> {
    const raw = await AsyncStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    const items: TodoAttributes[] = JSON.parse(raw);
    return items.map((attr) => new Todo(attr));
  }

  async addTodo(todo: Todo): Promise<void> {
    const todos = await this.loadTodos();
    todos.push(todo);
    await this.saveTodos(todos);
  }
}
