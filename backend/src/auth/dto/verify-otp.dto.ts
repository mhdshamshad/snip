import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../shared/decorators/trim.decorator';

export class VerifyOtpDto {
  @Trim()
  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp!: string;
}
