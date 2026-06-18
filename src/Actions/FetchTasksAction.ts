// src/Actions/FetchTasksAction.ts
import { TaskAttributes } from "../Models/Task";
import { http } from "../utils/http";

export class FetchTasksAction {
  async execute(): Promise<TaskAttributes[]> {
    return await http.get<TaskAttributes[]>("tasks/", true);
  }
}
