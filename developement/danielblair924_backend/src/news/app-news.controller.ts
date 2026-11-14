import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service.js';
import { NewsQueryDto } from './dto/news-query.dto.js';

@Controller('app/news')
export class AppNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getMobileNewsFeed(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query, false);
  }

  @Get(':id')
  async getMobileNewsDetail(@Param('id') id: string) {
    return this.newsService.findById(id, false);
  }
}

