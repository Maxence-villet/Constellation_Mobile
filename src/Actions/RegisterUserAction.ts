// src/Actions/RegisterUserAction.ts
import { RegisterUserDTO } from "../DTOs/RegisterUserDTO";
import { http } from "../utils/http";

export class RegisterUserAction {
  async execute(dto: RegisterUserDTO): Promise<void> {
    const payload = {
      first_name: dto.firstName,
      last_name: dto.lastName,
      pseudo: dto.pseudo,
      email: dto.email,
      password: dto.password,
    };
    await http.post<{ message: string }>(payload, "auth/register", false);
  }
}
