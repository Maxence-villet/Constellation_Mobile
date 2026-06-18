import { Member } from "../Models/Member";

// src/DTOs/FetchTaskDTO.ts
export interface FetchTaskDTO {
  constellationId: number;
  member: Member[];
}
