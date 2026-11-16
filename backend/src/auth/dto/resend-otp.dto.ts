import { EmailField } from '../../shared/decorators/validation.decorators';

export class ResendOtpDto {
  @EmailField() email!: string;
}
