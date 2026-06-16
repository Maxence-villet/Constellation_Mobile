// src/Actions/DeclineInvitationAction.ts
import { http } from "../utils/http";

export class DeclineInvitationAction {
  async execute(memberId: string): Promise<void> {
    await http.delete(`members/decline-invitation/${memberId}`, true);
  }
}
