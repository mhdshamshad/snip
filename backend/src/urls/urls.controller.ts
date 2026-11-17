import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ListUrlsQueryDto } from './dto/list-urls-query.dto';
import { UrlsService } from './urls.service';

@UseGuards(AuthGuard)
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  list(@CurrentUser('id') userId: string, @Query() query: ListUrlsQueryDto) {
    return this.urlsService.list(userId, query);
  }
}
