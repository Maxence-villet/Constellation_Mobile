// src/Models/Invitation.ts

export interface InvitationAttributes {
  id: string;
  id_user: string;
  id_constellation: string;
  constellation_name: string;
  role: string;
  is_invitation: boolean;
  invited_by_pseudo?: string;
  created_at?: string;
}

export class Invitation {
  public id: string;
  public id_user: string;
  public id_constellation: string;
  public constellation_name: string;
  public role: string;
  public is_invitation: boolean;
  public invited_by_pseudo?: string;
  public created_at?: string;

  constructor(attributes: InvitationAttributes) {
    this.id = attributes.id;
    this.id_user = attributes.id_user;
    this.id_constellation = attributes.id_constellation;
    this.constellation_name = attributes.constellation_name;
    this.role = attributes.role;
    this.is_invitation = attributes.is_invitation;
    this.invited_by_pseudo = attributes.invited_by_pseudo;
    this.created_at = attributes.created_at;
  }

  toJSON(): InvitationAttributes {
    return {
      id: this.id,
      id_user: this.id_user,
      id_constellation: this.id_constellation,
      constellation_name: this.constellation_name,
      role: this.role,
      is_invitation: this.is_invitation,
      invited_by_pseudo: this.invited_by_pseudo,
      created_at: this.created_at,
    };
  }
}
