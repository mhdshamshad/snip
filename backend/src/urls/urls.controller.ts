import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CheckAliasQueryDto } from './dto/check-alias-query.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { ListUrlsQueryDto } from './dto/list-urls-query.dto';
import { UrlResponse } from './dto/url-response.dto';
import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateUrlDto,
  ): Promise<UrlResponse> {
    return this.urlsService.create(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get('check-alias')
  async checkAlias(
    @Query() query: CheckAliasQueryDto,
  ): Promise<{ available: boolean }> {
    const available = await this.urlsService.isAliasAvailable(query.alias);
    return { available };
  }

  @Get('resolve/:code')
  async resolve(@Param('code') code: string): Promise<{ originalUrl: string }> {
    const originalUrl = await this.urlsService.resolve(code);
    if (!originalUrl) {
      throw new NotFoundException('Short link not found');
    }
    return { originalUrl };
  }

  @Get()
  @UseGuards(AuthGuard)
  list(@CurrentUser('id') userId: string, @Query() query: ListUrlsQueryDto) {
    return this.urlsService.list(userId, query);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) urlId: string,
  ): Promise<{ message: string }> {
    await this.urlsService.delete(userId, urlId);
    return { message: 'Link deleted successfully' };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getById(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.urlsService.getById(userId, id);
  }
}
