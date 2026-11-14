import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NewsService } from './news.service.js';
import { MediaService } from './media.service.js';
import { NewsController } from './news.controller.js';
import { AdminNewsController } from './admin-news.controller.js';
import { AppNewsController } from './app-news.controller.js';
import { MediaController } from './media.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    NewsController,
    AdminNewsController,
    AppNewsController,
    MediaController,
  ],
  providers: [NewsService, MediaService],
  exports: [NewsService, MediaService],
})
export class NewsModule {}

