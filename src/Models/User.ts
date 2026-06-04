// src/Models/User.ts
export interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  token?: string;
}

export class User {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public pseudo: string;
  public token?: string;

  constructor(attributes: UserAttributes) {
    this.id = attributes.id;
    this.email = attributes.email;
    this.firstName = attributes.firstName;
    this.lastName = attributes.lastName;
    this.pseudo = attributes.pseudo;
    this.token = attributes.token;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      pseudo: this.pseudo,
      token: this.token,
    };
  }
}
