import {
  EmailField,
  OtpField,
} from '../../shared/decorators/validation.decorators';

export class VerifyEmailChangeDto {
  @EmailField() email!: string;
  @OtpField() otp!: string;
}
