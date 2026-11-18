import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../shared/decorators/trim.decorator';
import {
  ALIAS_MAX,
  ALIAS_MESSAGE,
  ALIAS_MIN,
  ALIAS_REGEX,
} from '../url.constants';

export class CheckAliasQueryDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(ALIAS_MIN, ALIAS_MAX, { message: ALIAS_MESSAGE })
  @Matches(ALIAS_REGEX)
  alias!: string;
}
