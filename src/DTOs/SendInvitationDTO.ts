// src/DTOs/SendInvitationDTO.ts

// Doit correspondre exactement à l'enum Role du backend
export type MemberRole = "Soleil" | "Etoile";

export interface SendInvitationDTO {
  pseudocode: string; // format: pseudo#code
  role: MemberRole;
}
