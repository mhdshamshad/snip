import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UrlRepository } from './repositories/url.repository';
import { URL_REPOSITORY } from './repositories/IUrlRepository';
import { RedirectController } from './redirect.controller';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [AuthModule],
  controllers: [UrlsController, RedirectController],
  providers: [
    UrlsService,
    UrlRepository,
    {
      provide: URL_REPOSITORY,
      useExisting: UrlRepository,
    },
  ],
})
export class UrlsModule {}
