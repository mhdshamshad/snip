import {
  EmailField,
  OtpField,
} from '../../shared/decorators/validation.decorators';

export class VerifyOtpDto {
  @EmailField() email!: string;
  @OtpField() otp!: string;
}
