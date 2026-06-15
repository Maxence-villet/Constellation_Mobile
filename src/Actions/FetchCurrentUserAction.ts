// src/Actions/FetchCurrentUserAction.ts
import { User } from "../Models/User";
import { http } from "../utils/http";

export class FetchCurrentUserAction {
  async execute(): Promise<User> {
    const data = await http.get<{
      id: string;
      email: string;
      code: string;
      first_name: string;
      last_name: string;
      pseudo: string;
      subscription: string;
    }>("auth/profile", true);

    const user = new User({
      id: "1",
      email: data.email,
      code: data.code,
      firstName: data.first_name,
      lastName: data.last_name,
      pseudo: data.pseudo,
      token: undefined,
      subscription: data.subscription,
    });
    return user;
  }
}
