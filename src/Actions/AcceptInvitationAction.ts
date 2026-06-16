// src/Actions/AcceptInvitationAction.ts
import { http } from "../utils/http";

export class AcceptInvitationAction {
  async execute(memberId: string): Promise<void> {
    await http.post<{ message: string }>(
      {},
      `members/accept-invitation/${memberId}`,
      true,
    );
  }
}
