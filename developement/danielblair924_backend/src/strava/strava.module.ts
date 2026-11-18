import { Module } from '@nestjs/common';
import { StravaController } from './strava.controller.js';
import { StravaService } from './strava.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [StravaController],
  providers: [StravaService],
  exports: [StravaService],
})
export class StravaModule {}

