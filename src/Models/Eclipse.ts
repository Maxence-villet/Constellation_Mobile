// src/Models/Eclipse.ts

export interface EclipseAttributes {
  id: string;
  todoId: string;
  todoTitle: string;
  fromMemberId: string; // délégant
  toMemberId: string;   // récepteur (doit être Étoile)
  createdAt: string;    // ISO 8601
}

export class Eclipse {
  public id: string;
  public todoId: string;
  public todoTitle: string;
  public fromMemberId: string;
  public toMemberId: string;
  public createdAt: string;

  constructor(attributes: EclipseAttributes) {
    this.id = attributes.id;
    this.todoId = attributes.todoId;
    this.todoTitle = attributes.todoTitle;
    this.fromMemberId = attributes.fromMemberId;
    this.toMemberId = attributes.toMemberId;
    this.createdAt = attributes.createdAt;
  }

  formattedDate(): string {
    return new Date(this.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  toJSON(): EclipseAttributes {
    return {
      id: this.id,
      todoId: this.todoId,
      todoTitle: this.todoTitle,
      fromMemberId: this.fromMemberId,
      toMemberId: this.toMemberId,
      createdAt: this.createdAt,
    };
  }
}
