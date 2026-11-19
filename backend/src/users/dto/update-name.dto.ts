import { NameField } from '../../shared/decorators/validation.decorators';

export class ChangeNameDto {
  @NameField()
  name!: string;
}
