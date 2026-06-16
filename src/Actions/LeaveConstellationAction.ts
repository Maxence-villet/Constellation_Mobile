// src/Actions/LeaveConstellationAction.ts
import { http } from "../utils/http";

export class LeaveConstellationAction {
  async execute(constellationId: string): Promise<void> {
    await http.delete(`members/leave-constellation/${constellationId}`, true);
  }
}
