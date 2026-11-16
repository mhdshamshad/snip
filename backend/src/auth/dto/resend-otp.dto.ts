import { IsEmail, IsNotEmpty } from 'class-validator';
import { Trim } from '../../shared/decorators/trim.decorator';

export class ResendOtpDto {
  @Trim()
  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
