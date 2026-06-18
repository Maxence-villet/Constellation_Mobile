// src/Http/Controllers/useTodoController.ts
import { FetchTodosAction } from "@/src/Actions/FetchTodosAction";
import { useEffect, useState } from "react";
import { AssignTodoAction } from "../../Actions/AssignTodoAction";
import { CreateTodoAction } from "../../Actions/CreateTodoAction";
import { DeleteTodoAction } from "../../Actions/DeleteTodoAction";
import { ToggleTodoAction } from "../../Actions/ToggleTodoAction";
import { AssignTodoDTO } from "../../DTOs/AssignTodoDTO";
import { CreateTodoDTO } from "../../DTOs/CreateTodoDTO";
import { Todo } from "../../Models/Todo";

export function useTodoController() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const load = async () => {
      const action = new FetchTodosAction();
      const fetched = await action.execute();
      setTodos(fetched);
    };
    load();
  }, []);

  const add = (dto: CreateTodoDTO) => {
    const action = new CreateTodoAction();
    const newTodo = action.execute(dto);
    setTodos((prev: Todo[]) => [...prev, newTodo]);
  };

  const toggle = (todo: Todo) => {
    const action = new ToggleTodoAction();
    const toggled = action.execute(todo);
    setTodos((prev: Todo[]) =>
      prev.map((t: Todo) => (t.id === toggled.id ? toggled : t)),
    );
  };

  const remove = async (todo: Todo): Promise<void> => {
    const action = new DeleteTodoAction();
    await action.execute(todo);
    setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== todo.id));
  };

  const assign = async (dto: AssignTodoDTO): Promise<void> => {
    const action = new AssignTodoAction();
    const updatedTodo = await action.execute(dto);
    setTodos((prev: Todo[]) =>
      prev.map((t: Todo) => (t.id === updatedTodo.id ? updatedTodo : t)),
    );
  };

  return { todos, add, toggle, remove, assign };
}
