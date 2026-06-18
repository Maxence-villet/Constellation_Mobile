// src/Actions/CreateEclipseAction.ts
import { CreateEclipseDTO } from "../DTOs/CreateEclipseDTO";
import { eclipseEmitter, EclipseEvents } from "../Events/EclipseEvents";
import { Eclipse } from "../Models/Eclipse";
import { Todo, TodoAttributes } from "../Models/Todo";
import { http } from "../utils/http";

export class CreateEclipseAction {
  async execute(dto: CreateEclipseDTO): Promise<Todo> {
    // Le backend change le responsable, conserve l'historique
    // et envoie une notification push à l'Étoile réceptrice
    const data = await http.post<TodoAttributes>(
      { to_member_id: dto.toMemberId },
      `todos/${dto.todoId}/eclipse`,
      true,
    );
    const updatedTodo = new Todo(data);

    // Émettre l'Eclipse la plus récente de l'historique
    if (updatedTodo.eclipse_history?.length) {
      const latest =
        updatedTodo.eclipse_history[updatedTodo.eclipse_history.length - 1];
      eclipseEmitter.emit(EclipseEvents.ECLIPSE_CREATED, new Eclipse(latest));
    }

    return updatedTodo;
  }
}
