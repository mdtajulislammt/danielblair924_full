import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { CreateBadgeDto } from './dto/create-badge.dto.js';
import { UpdateBadgeDto } from './dto/update-badge.dto.js';
import { BadgeQueryDto } from './dto/badge-query.dto.js';
import { AwardBadgeDto } from './dto/award-badge.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('admin/badges')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminBadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  async getBadges(@Query() query: BadgeQueryDto) {
    return this.badgesService.findAll(query);
  }

  @Get(':id')
  async getBadge(@Param('id') id: string) {
    return this.badgesService.findByIdOrSlug(id);
  }

  @Post()
  async createBadge(@Body() dto: CreateBadgeDto) {
    return this.badgesService.create(dto);
  }

  @Patch(':id')
  async updateBadge(
    @Param('id') id: string,
    @Body() dto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(id, dto);
  }

  @Delete(':id')
  async deleteBadge(@Param('id') id: string) {
    return this.badgesService.delete(id);
  }

  @Post(':id/award')
  async awardBadge(
    @Param('id') id: string,
    @Body() dto: AwardBadgeDto,
  ) {
    return this.badgesService.awardBadge(dto.userId, id);
  }

  @Delete(':id/revoke/:userId')
  async revokeBadge(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.badgesService.revokeBadge(userId, id);
  }
}

