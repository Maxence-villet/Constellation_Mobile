// src/Actions/FetchInvitationsAction.ts
import { Invitation, InvitationAttributes } from "../Models/Invitation";
import { http } from "../utils/http";

export class FetchInvitationsAction {
  async execute(): Promise<Invitation[]> {
    const response = await http.get<{ invitations: InvitationAttributes[] }>(
      "members/invitation",
      true,
    );
    return response.invitations.map((inv) => new Invitation(inv));
  }
}
