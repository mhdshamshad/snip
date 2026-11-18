import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { Trim } from '../../shared/decorators/trim.decorator';
import { Prisma } from '@prisma/client';

export enum UrlSortBy {
  CreatedAt = 'createdAt',
  Clicks = 'clicks',
}

export class ListUrlsQueryDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(UrlSortBy)
  sortBy: UrlSortBy = UrlSortBy.CreatedAt;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order: Prisma.SortOrder = Prisma.SortOrder.desc;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsUUID()
  cursor?: string;
}
