import { EmailField } from '../../shared/decorators/validation.decorators';

export class RequestEmailChangeDto {
  @EmailField() email!: string;
}
