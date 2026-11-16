import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../shared/decorators/trim.decorator';

export class LoginDto {
  @Trim()
  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
