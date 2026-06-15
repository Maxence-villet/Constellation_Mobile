// src/Models/Member.ts
import { User } from "./User";

export interface MemberAttributes {
  id: string;
  id_user: string;
  role: string;
  id_constellation: string;
  joined_at: string;
  is_invitation: boolean;
  pseudo?: string;
  user: User;
}

export class Member {
  public id: string;
  public id_user: string;
  public role: string;
  public id_constellation: string;
  public joined_at: string;
  public is_invitation: boolean;
  public pseudo?: string;
  public user: User;

  constructor(attributes: MemberAttributes) {
    this.id = attributes.id;
    this.id_user = attributes.id_user;
    this.role = attributes.role;
    this.id_constellation = attributes.id_constellation;
    this.joined_at = attributes.joined_at;
    this.is_invitation = attributes.is_invitation;
    this.pseudo = attributes.pseudo;
    this.user = attributes.user;
  }

  toJSON() {
    return {
      id: this.id,
      id_user: this.id_user,
      role: this.role,
      id_constellation: this.id_constellation,
      joined_at: this.joined_at,
      is_invitation: this.is_invitation,
      pseudo: this.pseudo,
    };
  }
}
