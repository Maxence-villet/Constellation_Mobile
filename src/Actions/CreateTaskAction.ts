// src/Actions/CreateTaskAction.ts
import { CreateTaskDTO } from "../DTOs/CreateTaskDTO";
import { http } from "../utils/http";

export class CreateTaskAction {
  async execute(
    dto: CreateTaskDTO,
  ): Promise<{ message: string; id: string }> {
    return await http.post<{ message: string; id: string }>(
      dto,
      "tasks/create",
      true,
    );
  }
}
