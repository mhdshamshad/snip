import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../shared/decorators/trim.decorator';
import { EmailField } from '../../shared/decorators/validation.decorators';

export class LoginDto {
  @EmailField() email!: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
