import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BadgesService } from './badges.service.js';
import { BadgesController } from './badges.controller.js';
import { AdminBadgesController } from './admin-badges.controller.js';
import { AppBadgesController } from './app-badges.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    BadgesController,
    AdminBadgesController,
    AppBadgesController,
  ],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}

