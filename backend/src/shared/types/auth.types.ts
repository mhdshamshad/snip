export interface JwtPayload {
  sub: string;
  email: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  deviceId: string;
}
