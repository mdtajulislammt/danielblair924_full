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

@Controller('admin/news')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getAdminNews(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query, true);
  }

  @Get(':id')
  async getAdminNewsById(@Param('id') id: string) {
    return this.newsService.findById(id, true);
  }

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async createNewsPost(
    @Body() dto: CreateNewsDto,
    @CurrentUser('id') authorId?: string,
    @UploadedFileDecorator() file?: UploadedFile,
  ) {
    return this.newsService.create(dto, authorId, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImage'))
  async updateNewsPost(
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
    @UploadedFileDecorator() file?: UploadedFile,
  ) {
    return this.newsService.update(id, dto, file);
  }

  @Delete(':id')
  async deleteNewsPost(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}
