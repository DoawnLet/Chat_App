export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  handle: string;
  displayName: string;
  password: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  flag: boolean;
  message: string;
  data?: {
    id: string;
    handle: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
  };
}
