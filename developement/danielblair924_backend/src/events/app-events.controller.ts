import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventQueryDto } from './dto/event-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { EventStatus } from '../generated/prisma/client.js';

@Controller('app/events')
@UseGuards(JwtAuthGuard)
export class AppEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents(@Query() query: EventQueryDto) {
    return this.eventsService.getEvents(query, EventStatus.PUBLISHED);
  }

  @Get(':id')
  async getEventById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.getEventById(id, userId);
  }

  @Post(':id/join')
  async joinEvent(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.joinEvent(id, userId);
  }
}
