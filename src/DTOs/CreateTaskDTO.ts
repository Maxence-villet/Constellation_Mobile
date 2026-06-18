// src/DTOs/CreateTaskDTO.ts
import { TaskCategory, TaskPriority } from "../Models/Task";

export interface CreateTaskDTO {
  title: string;
  description: string;
  constellation_id: string;
  assigned_to: string | null;
  priority: TaskPriority;
  category: TaskCategory;
}
