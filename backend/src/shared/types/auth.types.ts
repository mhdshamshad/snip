export interface JwtPayload {
  sub: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  deviceId: string;
}
