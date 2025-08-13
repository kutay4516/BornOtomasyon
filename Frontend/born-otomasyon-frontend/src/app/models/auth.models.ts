// src/app/models/auth.models.ts
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  expiration: Date;
}

export interface User {
  id: string;
  email: string;
}
