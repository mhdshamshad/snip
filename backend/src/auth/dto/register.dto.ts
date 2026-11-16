import {
  EmailField,
  NameField,
  PasswordField,
} from '../../shared/decorators/validation.decorators';

export class RegisterDto {
  @NameField() name!: string;
  @EmailField() email!: string;
  @PasswordField() password!: string;
}
