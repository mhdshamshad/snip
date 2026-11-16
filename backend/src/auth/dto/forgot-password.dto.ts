import { EmailField } from '../../shared/decorators/validation.decorators';

export class ForgotPasswordDto {
  @EmailField() email!: string;
}
