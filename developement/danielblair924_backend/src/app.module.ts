import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { SubmissionsModule } from './submissions/submissions.module.js';
import { EventsModule } from './events/events.module.js';
import { ChallengesModule } from './challenges/challenges.module.js';
import { BadgesModule } from './badges/badges.module.js';
import { NewsModule } from './news/news.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { StravaModule } from './strava/strava.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    SubmissionsModule,
    EventsModule,
    ChallengesModule,
    BadgesModule,
    NewsModule,
    SettingsModule,
    StravaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

