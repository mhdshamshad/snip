import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ChangeNameDto } from './dto/update-name.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() { name }: ChangeNameDto,
  ) {
    const user = await this.usersService.updateUserName(userId, name);
    return {
      user,
      message: 'profile name updated successfully',
    };
  }
}
