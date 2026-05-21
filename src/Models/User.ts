// src/Models/User.ts
export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export class User {
  public id: string;
  public email: string;
  public name: string;
  public token?: string;

  constructor(attributes: UserAttributes) {
    this.id = attributes.id;
    this.email = attributes.email;
    this.name = attributes.name;
    this.token = attributes.token;
  }

  toJSON(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      token: this.token,
    };
  }
}
