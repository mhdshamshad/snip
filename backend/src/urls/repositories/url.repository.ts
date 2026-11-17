import { Injectable } from '@nestjs/common';
import type { Prisma, Url } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { ListUrlsQueryDto, UrlSortBy } from '../dto/list-urls-query.dto';
import type { IUrlRepository } from './IUrlRepository';
import { CursorPaginatedResult } from '../../shared/types/pagination.types';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByUser(
    userId: string,
    { search, sortBy, order, limit, cursor }: ListUrlsQueryDto,
  ): Promise<CursorPaginatedResult<Url>> {
    const data = await this.prisma.url.findMany({
      where: {
        userId,
        ...(search && {
          OR: [
            { originalUrl: { contains: search, mode: 'insensitive' } },
            { shortCode: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: [
        sortBy === UrlSortBy.Clicks ? { clicks: order } : { createdAt: order },
        { id: order },
      ],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    let nextCursor: string | null = null;
    if (data.length > limit) {
      data.pop();
      nextCursor = data[data.length - 1].id;
    }

    return { data, nextCursor };
  }
}
