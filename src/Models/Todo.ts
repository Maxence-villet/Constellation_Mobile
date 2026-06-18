// src/Models/Todo.ts
import { EclipseAttributes } from "./Eclipse";

export interface TodoAttributes {
  id: string;
  title: string;
  completed: boolean;
  assigned_to?: string | null;
  eclipse_history?: EclipseAttributes[];
}

export class Todo {
  public id: string;
  public title: string;
  public completed: boolean;
  public assigned_to?: string | null;
  public eclipse_history?: EclipseAttributes[];

  constructor(attributes: TodoAttributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.completed = attributes.completed;
    this.assigned_to = attributes.assigned_to ?? null;
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
      assigned_to: this.assigned_to,
      eclipse_history: this.eclipse_history,
    };
  }
}
