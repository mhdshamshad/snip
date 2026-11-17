import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) urlId: string,
  ): Promise<{ message: string }> {
    await this.urlsService.delete(userId, urlId);
    return { message: 'Link deleted successfully' };
  }
}
