import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.validation';
import type { ListUrlsQueryDto } from './dto/list-urls-query.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { URL_REPOSITORY } from './repositories/IUrlRepository';
import type { IUrlRepository } from './repositories/IUrlRepository';
import { CursorPaginatedResult } from '../shared/types/pagination.types';
import { toUrlResponse, UrlResponse } from './dto/url-response.dto';
import { RESERVED_ALIASES } from './url.constants';
import { generateShortCode } from '../shared/utils/short-code.util';

const MAX_CODE_ATTEMPTS = 5;

@Injectable()
export class UrlsService {
  private readonly baseUrl: string;

  constructor(
    @Inject(URL_REPOSITORY) private readonly urlRepo: IUrlRepository,
    private readonly configService: ConfigService<Env, true>,
  ) {
    this.baseUrl = this.configService.get('BASE_URL', { infer: true });
  }

  async create(
    userId: string,
    { originalUrl, customAlias }: CreateUrlDto,
  ): Promise<UrlResponse> {
    this.assertNotSelfLink(originalUrl);

    if (customAlias && this.isReserved(customAlias)) {
      throw new ConflictException('This alias is already taken');
    }

    const attempts = customAlias ? 1 : MAX_CODE_ATTEMPTS;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const url = await this.urlRepo.create({
        userId,
        originalUrl,
        shortCode: customAlias ?? generateShortCode(),
      });
      if (url) return toUrlResponse(url, this.baseUrl);
    }

    throw customAlias
      ? new ConflictException('This alias is already taken')
      : new ServiceUnavailableException(
          'Could not generate a short code. Please try again.',
        );
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
  resolve(code: string): Promise<string | null> {
    return this.urlRepo.registerClick(code);
  }
  async isAliasAvailable(alias: string): Promise<boolean> {
    if (this.isReserved(alias)) return false;
    return !(await this.urlRepo.existsByShortCode(alias));
  }

  async getById(userId: string, id: string): Promise<UrlResponse> {
    const url = await this.urlRepo.findOwnedById(id, userId);
    if (!url) throw new NotFoundException('Link not found');
    return toUrlResponse(url, this.baseUrl);
  }

  private isReserved(alias: string): boolean {
    return RESERVED_ALIASES.has(alias.toLowerCase());
  }

  private assertNotSelfLink(originalUrl: string): void {
    let host: string;
    try {
      host = new URL(originalUrl).host;
    } catch {
      throw new BadRequestException('A valid URL is required');
    }
    if (host === this.baseUrl) {
      throw new BadRequestException(
        'You cannot shorten a link that points to this service',
      );
    }
  }
}
