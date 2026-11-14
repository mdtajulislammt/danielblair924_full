import { Module } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';
import { AdminEventsController } from './admin-events.controller.js';
import { AppEventsController } from './app-events.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController, AdminEventsController, AppEventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

