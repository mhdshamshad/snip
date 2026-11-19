import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PasswordField } from '../../shared/decorators/validation.decorators';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  @MaxLength(25)
  currentPassword!: string;

  @PasswordField()
  newPassword!: string;
}
