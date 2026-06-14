import { CreateConstellationDTO } from "../DTOs/CreateConstellationDTO";
import { http } from "../utils/http";

interface CreateConstellationResponse {
  message: string;
  id: string;
}

export class CreateConstellationAction {
  async execute(dto: CreateConstellationDTO): Promise<string> {
    const response = await http.post<CreateConstellationResponse>(
      dto,
      "constellations/create",
      true,
    );
    return response.id;
  }
}
