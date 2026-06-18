// src/Http/Controllers/useTaskController.ts
import { useEffect, useRef, useState } from "react";
import { CreateTaskAction } from "@/src/Actions/CreateTaskAction";
import { FetchTasksAction } from "@/src/Actions/FetchTasksAction";
import { CreateTaskDTO } from "@/src/DTOs/CreateTaskDTO";
import { TaskAttributes } from "@/src/Models/Task";

export function useTaskController(constellationId: string) {
  const [tasks, setTasks] = useState<TaskAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const constellationIdRef = useRef(constellationId);
  constellationIdRef.current = constellationId;

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const action = new FetchTasksAction();
      const allTasks = await action.execute();
      const filtered = allTasks.filter(
        (t) =>
          String(t.constellation_id) === String(constellationIdRef.current),
      );
      setTasks(filtered);
    } catch {
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [constellationId]);

  const createTask = async (dto: CreateTaskDTO): Promise<void> => {
    const action = new CreateTaskAction();
    await action.execute(dto);
    await loadTasks();
  };

  return { tasks, isLoading, loadTasks, createTask };
}
