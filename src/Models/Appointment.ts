// src/Models/Appointment.ts

export interface ReminderAttributes {
  offsetMinutes: number;
  label: string;
}

export interface AppointmentAttributes {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO 8601 : "2024-12-25T14:30:00"
  constellationId: string;
  reminders: ReminderAttributes[];
  assigned_to_member_id?: string | null; // membre à qui appartient le RDV
  created_by_user_id?: string | null; // créateur (pour contrôle suppression)
}

export class Appointment {
  public id: string;
  public title: string;
  public description?: string;
  public date: string;
  public constellationId: string;
  public reminders: ReminderAttributes[];
  public assigned_to_member_id?: string | null;
  public created_by_user_id?: string | null;

  // Les 3 rappels activés par défaut (T-24h, T-3h, T-1h)
  static readonly DEFAULT_REMINDERS: ReminderAttributes[] = [
    { offsetMinutes: 24 * 60, label: "24h avant" },
    { offsetMinutes: 3 * 60, label: "3h avant" },
    { offsetMinutes: 60, label: "1h avant" },
  ];

  constructor(attributes: AppointmentAttributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.description = attributes.description;
    this.date = attributes.date;
    this.constellationId = attributes.constellationId;
    this.reminders = attributes.reminders ?? [...Appointment.DEFAULT_REMINDERS];
    this.assigned_to_member_id = attributes.assigned_to_member_id ?? null;
    this.created_by_user_id = attributes.created_by_user_id ?? null;
  }

  formattedDate(): string {
    const d = new Date(this.date);
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  formattedTime(): string {
    const d = new Date(this.date);
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  toJSON(): AppointmentAttributes {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date,
      constellationId: this.constellationId,
      reminders: this.reminders,
      assigned_to_member_id: this.assigned_to_member_id,
      created_by_user_id: this.created_by_user_id,
    };
  }
}
