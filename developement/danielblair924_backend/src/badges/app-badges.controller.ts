import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('app/badges')
@UseGuards(JwtAuthGuard)
export class AppBadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('my-badges')
  async getMyBadges(@CurrentUser('id') userId: string) {
    return this.badgesService.getMyBadges(userId);
  }

  @Get(':slug')
  async getBadgeDetail(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
  ) {
    return this.badgesService.getBadgeBySlug(slug, userId);
  }
}

