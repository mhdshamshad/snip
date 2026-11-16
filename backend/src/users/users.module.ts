import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { USER_REPOSITORY } from './repositories/IUserRepository';

@Module({
  providers: [
    UserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
