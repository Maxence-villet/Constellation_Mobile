// src/Models/Task.ts
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "pending_validation" | "done";
export type TaskCategory = "chore" | "errand" | "work" | "other";

export interface TaskAttributes {
  id: string;
  title: string;
  description: string;
  constellation_id: string;
  created_by: string;
  assigned_to: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  points: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  members: Member[];
}

export class Task {
  public id: string;
  public title: string;
  public description: string;
  public constellation_id: string;
  public created_by: string;
  public assigned_to: string | null;
  public status: TaskStatus;
  public priority: TaskPriority;
  public category: TaskCategory;
  public points: number;
  public is_archived: boolean;
  public created_at: string;
  public updated_at: string;
  public members: Member[];
  constructor(attributes: Partial<TaskAttributes> & Record<string, any>) {
    this.id = attributes.id ?? "";
    this.title = attributes.title ?? "";
    this.description = attributes.description ?? "";
    this.constellation_id = String(attributes.constellation_id ?? "");
    this.created_by = String(attributes.created_by ?? "");
    this.assigned_to = attributes.assigned_to ?? null;
    this.status = attributes.status ?? "todo";
    this.priority = attributes.priority ?? "low";
    this.category = attributes.category ?? "work";
    this.points = attributes.points ?? 0;
    this.is_archived = attributes.is_archived ?? false;
    this.created_at = attributes.created_at ?? "";
    this.updated_at = attributes.updated_at ?? "";
    this.members = attributes.members ?? [];
  }

  toJSON(): TaskAttributes {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      constellation_id: this.constellation_id,
      created_by: this.created_by,
      assigned_to: this.assigned_to,
      status: this.status,
      priority: this.priority,
      category: this.category,
      points: this.points,
      is_archived: this.is_archived,
      created_at: this.created_at,
      updated_at: this.updated_at,
      members: this.members,
    };
  }
}
