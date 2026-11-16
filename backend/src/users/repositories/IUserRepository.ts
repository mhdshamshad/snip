import { User } from '@prisma/client';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type UserUpdateData = Partial<
  Pick<User, 'name' | 'email' | 'passwordHash'>
>;

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User>;
  update(userId: string, data: UserUpdateData): Promise<User>;
}
