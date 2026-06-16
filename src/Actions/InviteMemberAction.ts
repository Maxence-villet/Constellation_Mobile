// src/Actions/InviteMemberAction.ts
import { SendInvitationDTO } from "../DTOs/SendInvitationDTO";
import { http } from "../utils/http";

interface InviteMemberResponse {
  message: string;
  id: string;
}

export class InviteMemberAction {
  async execute(
    dto: SendInvitationDTO,
    constellationId: string,
  ): Promise<string> {
    const response = await http.post<InviteMemberResponse>(
      dto,
      `members/add/${constellationId}`,
      true,
    );
    return response.id;
  }
}
