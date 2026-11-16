import {
  EmailField,
  OtpField,
  PasswordField,
} from '../../shared/decorators/validation.decorators';

export class ResetPasswordDto {
  @EmailField() email!: string;
  @OtpField() otp!: string;
  @PasswordField() newPassword!: string;
}
