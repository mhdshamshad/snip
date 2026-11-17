import type { Url } from '@prisma/client';

import type { ListUrlsQueryDto } from '../dto/list-urls-query.dto';
import { CursorPaginatedResult } from '../../shared/types/pagination.types';

export const URL_REPOSITORY = Symbol('URL_REPOSITORY');

export interface IUrlRepository {
  findManyByUser(
    userId: string,
    query: ListUrlsQueryDto,
  ): Promise<CursorPaginatedResult<Url>>;
  deleteForUser(userId: string, urlId: string): Promise<boolean>;
}
