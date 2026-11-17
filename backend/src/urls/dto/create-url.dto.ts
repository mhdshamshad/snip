import { Transform } from 'class-transformer';
import { IsOptional, IsUrl, Length, Matches, MaxLength } from 'class-validator';

import { Trim } from '../../shared/decorators/trim.decorator';
import {
  ALIAS_MAX,
  ALIAS_MESSAGE,
  ALIAS_MIN,
  ALIAS_REGEX,
} from '../url.constants';

export class CreateUrlDto {
  @Trim()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'A valid http or https URL is required' },
  )
  @MaxLength(2048, { message: 'URL is too long' })
  originalUrl!: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  @Length(ALIAS_MIN, ALIAS_MAX, { message: ALIAS_MESSAGE })
  @Matches(ALIAS_REGEX, { message: ALIAS_MESSAGE })
  customAlias?: string;
}
