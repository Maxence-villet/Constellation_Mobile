// src/Models/Todo.ts
export interface TodoAttributes {
  id: string;
  title: string;
  completed: boolean;
}

export class Todo {
  public id: string;
  public title: string;
  public completed: boolean;

  constructor(attributes: TodoAttributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.completed = attributes.completed;
  }

  toggle(): Todo {
    return new Todo({ ...this, completed: !this.completed });
  }

  toJSON(): TodoAttributes {
    return { id: this.id, title: this.title, completed: this.completed };
  }
}
