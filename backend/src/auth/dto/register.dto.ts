import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from '../../shared/decorators/trim.decorator';

export class RegisterDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 2 characters' })
  @MaxLength(30, { message: 'Name cannot exceed 30 characters' })
  @Matches(/^(?=.{3,30}$)[A-Za-z]+( [A-Za-z]+)*$/, {
    message:
      'Name must be 3-30 characters and contain only letters separated by single spaces',
  })
  name!: string;

  @Trim()
  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(25, { message: 'Password cannot exceed 25 characters' })
  @Matches(/[a-z]/, { message: 'Must contain a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Must contain an uppercase letter' })
  @Matches(/\d/, { message: 'Must contain a number' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Must contain a special character' })
  password!: string;
}
