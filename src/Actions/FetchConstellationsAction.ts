// src/Actions/FetchConstellationAction.ts
import { Constellation } from "../Models/Constellation";
import { http } from "../utils/http";

export class FetchConstellationsAction {
  async execute(): Promise<Constellation[]> {
    return await http.get<Constellation[]>("constellations", true);
  }
}
