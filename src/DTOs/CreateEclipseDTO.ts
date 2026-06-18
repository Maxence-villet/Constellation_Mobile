// src/DTOs/CreateEclipseDTO.ts
export interface CreateEclipseDTO {
  todoId: string;
  toMemberId: string; // membre récepteur — doit avoir le rôle Étoile
}
