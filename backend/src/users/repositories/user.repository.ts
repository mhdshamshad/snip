import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { IUserRepository } from './IUserRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { id },
    });
  }
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
