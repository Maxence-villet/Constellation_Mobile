import { CreateConstellationAction } from "@/src/Actions/CreateConstellationAction";
import { FetchConstellationsAction } from "@/src/Actions/FetchConstellationsAction";
import { CreateConstellationDTO } from "@/src/DTOs/CreateConstellationDTO";
import { Constellation } from "@/src/Models/Constellation";
import { useEffect, useState } from "react";

export function useConstellationController() {
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConstellations = async () => {
    try {
      setIsLoading(true);
      const action = new FetchConstellationsAction();
      const data = await action.execute();
      setConstellations(data);
    } catch (error: any) {
      if (
        error.message?.includes("Aucune constellation") ||
        error.status === 404
      ) {
        setConstellations([]);
      } else {
        console.error(
          "Erreur inattendue lors du chargement des constellations",
          error,
        );
        setConstellations([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConstellations();
  }, []);

  const create = async (dto: CreateConstellationDTO) => {
    const action = new CreateConstellationAction();
    const constellationId = await action.execute(dto);
    await loadConstellations();
    return constellationId;
  };

  return { constellations, isLoading, create, refresh: loadConstellations };
}
