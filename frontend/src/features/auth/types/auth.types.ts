export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface GoogleAuthPayload {
  idToken: string;
}
