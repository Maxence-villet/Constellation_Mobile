// src/Models/Constellation.ts

import { Member } from "./Member";

export interface ConstellationAttributes {
  id: string;
  name: string;
  description: string;
  superUser: string;
  createdAt?: string;
  members: Member[];
}

export class Constellation {
  public id: string;
  public name: string;
  public description: string;
  public superUser: string;
  public createdAt?: string;
  public members: Member[];

  constructor(attributes: ConstellationAttributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.superUser = attributes.superUser;
    this.createdAt = attributes.createdAt;
    this.members = attributes.members;
  }

  toJSON(): ConstellationAttributes {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      superUser: this.superUser,
      createdAt: this.createdAt,
      members: this.members,
    };
  }
}
