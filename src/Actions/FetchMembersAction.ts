// src/Actions/FetchMembersAction.ts
import { Member } from "../Models/Member";
import { http } from "../utils/http";

export class FetchMembersAction {
  async execute(constellationId: string): Promise<Member[]> {
    const response = await http.get<{ members: Member[] }>(
      `members/${constellationId}`,
      true,
    );
    return response.members;
  }
}
