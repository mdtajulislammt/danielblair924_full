import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile as UploadedFileDecorator,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsService } from './news.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';
import { NewsQueryDto } from './dto/news-query.dto.js';
import type { UploadedFile } from './media.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getPublishedNews(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query, false);
  }

  @Get(':id')
  async getNewsById(@Param('id') id: string) {
    return this.newsService.findById(id, false);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @UseInterceptors(FileInterceptor('coverImage'))
  async createNews(
    @Body() dto: CreateNewsDto,
    @CurrentUser('id') authorId?: string,
    @UploadedFileDecorator() file?: UploadedFile,
  ) {
    return this.newsService.create(dto, authorId, file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @UseInterceptors(FileInterceptor('coverImage'))
  async updateNews(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
    @UploadedFileDecorator() file?: UploadedFile,
  ) {
    return this.newsService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async deleteNews(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}
