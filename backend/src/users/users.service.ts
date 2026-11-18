import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from './repositories/IUserRepository';
import { toUserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async updateUserName(userId: string, name: string) {
    const user = await this.userRepo.update(userId, { name });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return toUserResponse(user);
  }
}
