import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from '../config/env.validation';
import { ALIAS_REGEX } from './url.constants';
import { UrlsService } from './urls.service';

@Controller('r')
export class RedirectController {
  private readonly notFoundUrl: string;

  constructor(
    private readonly urlsService: UrlsService,
    configService: ConfigService<Env, true>,
  ) {
    const frontendUrl = configService
      .getOrThrow('FRONTEND_URL', { infer: true })
      .split(',')[0]
      .trim()
      .replace(/\/+$/, '');
    this.notFoundUrl = `${frontendUrl}/404`;
  }

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string) {
    const target = ALIAS_REGEX.test(code)
      ? await this.urlsService.resolve(code)
      : null;

    return { url: target ?? this.notFoundUrl, statusCode: 302 };
  }
}
