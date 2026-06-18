// src/Models/Todo.ts
import { EclipseAttributes } from "./Eclipse";

export type TodoStatus = "todo" | "pending" | "validated";

export interface TodoAttributes {
  id: string;
  title: string;
  completed: boolean;
  status: TodoStatus;
  assigned_to?: string | null;
  assigned_by?: string | null; // membre qui a donné la tâche
  eclipse_history?: EclipseAttributes[];
}

export class Todo {
  public id: string;
  public title: string;
  public completed: boolean;
  public status: TodoStatus;
  public assigned_to?: string | null;
  public assigned_by?: string | null;
  public eclipse_history?: EclipseAttributes[];

  constructor(attributes: TodoAttributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.completed = attributes.completed;
    // Rétro-compatibilité : si pas de status, on déduit de completed
    this.status =
      attributes.status ?? (attributes.completed ? "validated" : "todo");
    this.assigned_to = attributes.assigned_to ?? null;
    this.assigned_by = attributes.assigned_by ?? null;
    this.eclipse_history = attributes.eclipse_history ?? [];
  }

  toggle(): Todo {
    return new Todo({ ...this, completed: !this.completed });
  }

  toJSON(): TodoAttributes {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      status: this.status,
      assigned_to: this.assigned_to,
      assigned_by: this.assigned_by,
      eclipse_history: this.eclipse_history,
    };
  }
}
