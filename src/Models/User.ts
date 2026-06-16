// src/Models/User.ts
export interface UserAttributes {
  id: string;
  email: string;
  code: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  token?: string;
  subscription: string;
  isCurrentUser?: boolean;
}

export class User {
  public id: string;
  public email: string;
  public code: string;
  public firstName: string;
  public lastName: string;
  public pseudo: string;
  public token?: string;
  public subscription: string;
  public isCurrentUser?: boolean;

  constructor(attributes: UserAttributes) {
    this.id = attributes.id;
    this.email = attributes.email;
    this.code = attributes.code;
    this.firstName = attributes.firstName;
    this.lastName = attributes.lastName;
    this.pseudo = attributes.pseudo;
    this.token = attributes.token;
    this.subscription = attributes.subscription;
    this.isCurrentUser = attributes.isCurrentUser;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      code: this.code,
      firstName: this.firstName,
      lastName: this.lastName,
      pseudo: this.pseudo,
      token: this.token,
      subscription: this.subscription,
      isCurrentUser: this.isCurrentUser,
    };
  }
}
