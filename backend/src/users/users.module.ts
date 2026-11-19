import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRepository } from './repositories/user.repository';
import { USER_REPOSITORY } from './repositories/IUserRepository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UsersController],
  providers: [
    AuthGuard,
    UsersService,
    UserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY, UsersService],
})
export class UsersModule {}
