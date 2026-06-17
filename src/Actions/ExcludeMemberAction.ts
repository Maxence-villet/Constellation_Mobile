// src/Actions/ExcludeMemberAction.ts
import { http } from "../utils/http";

export class ExcludeMemberAction {
  async execute(memberId: string): Promise<void> {
    await http.delete(`members/exclude-member/${memberId}`, true);
  }
}
