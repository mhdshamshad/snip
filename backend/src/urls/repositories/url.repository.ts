import { Injectable } from '@nestjs/common';
import { Prisma, type Url } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { ListUrlsQueryDto, UrlSortBy } from '../dto/list-urls-query.dto';
import type { IUrlRepository } from './IUrlRepository';
import { CursorPaginatedResult } from '../../shared/types/pagination.types';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    originalUrl: string;
    shortCode: string;
  }): Promise<Url | null> {
    try {
      return await this.prisma.url.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return null;
      }
      throw error;
    }
  }

  async existsByShortCode(shortCode: string): Promise<boolean> {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
      select: { id: true },
    });
    return url !== null;
  }

  async registerClick(shortCode: string): Promise<string | null> {
    try {
      const url = await this.prisma.url.update({
        where: { shortCode },
        data: { clicks: { increment: 1 } },
        select: { originalUrl: true },
      });

      return url.originalUrl;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }

      throw error;
    }
  }

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
  async deleteForUser(userId: string, urlId: string): Promise<boolean> {
    const result = await this.prisma.url.deleteMany({
      where: {
        id: urlId,
        userId,
      },
    });

    return result.count > 0;
  }
}
