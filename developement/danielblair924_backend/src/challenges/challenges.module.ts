import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service.js';
import { ChallengesController } from './challenges.controller.js';
import { AdminChallengesController } from './admin-challenges.controller.js';
import { AppChallengesController } from './app-challenges.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [
    ChallengesController,
    AdminChallengesController,
    AppChallengesController,
  ],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}

