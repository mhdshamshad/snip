import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.validation';
import type { ListUrlsQueryDto } from './dto/list-urls-query.dto';
import { URL_REPOSITORY } from './repositories/IUrlRepository';
import type { IUrlRepository } from './repositories/IUrlRepository';
import { CursorPaginatedResult } from '../shared/types/pagination.types';
import { toUrlResponse, UrlResponse } from './dto/url-response.dto';

@Injectable()
export class UrlsService {
  private readonly baseUrl: string;
  constructor(
    @Inject(URL_REPOSITORY) private readonly urlRepo: IUrlRepository,
    private readonly configService: ConfigService<Env, true>,
  ) {
    this.baseUrl = this.configService.get('BASE_URL', { infer: true });
  }

  async list(
    userId: string,
    query: ListUrlsQueryDto,
  ): Promise<CursorPaginatedResult<UrlResponse>> {
    const { data, nextCursor } = await this.urlRepo.findManyByUser(
      userId,
      query,
    );

    return {
      data: data.map((url) => toUrlResponse(url, this.baseUrl)),
      nextCursor,
    };
  }

  async delete(userId: string, urlId: string): Promise<void> {
    const deleted = await this.urlRepo.deleteForUser(userId, urlId);
    if (!deleted) {
      throw new NotFoundException('URL not found');
    }
  }
}
