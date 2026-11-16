import { User } from '@prisma/client';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export function toUserResponse(
  user: Pick<User, 'id' | 'name' | 'email' | 'createdAt'>,
): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
