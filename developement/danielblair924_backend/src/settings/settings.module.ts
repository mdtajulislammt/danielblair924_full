import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { SettingsService } from './settings.service.js';
import { AdminSettingsController } from './admin-settings.controller.js';
import { SettingsController } from './settings.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [AdminSettingsController, SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}

