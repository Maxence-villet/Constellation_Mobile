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
}

export class Appointment {
  public id: string;
  public title: string;
  public description?: string;
  public date: string;
  public constellationId: string;
  public reminders: ReminderAttributes[];

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
    };
  }
}
