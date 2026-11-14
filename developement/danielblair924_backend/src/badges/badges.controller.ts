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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  async getBadges(@Query() query: BadgeQueryDto) {
    return this.badgesService.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyBadges(@CurrentUser('id') userId: string) {
    return this.badgesService.getMyBadges(userId);
  }

  @Get(':idOrSlug')
  async getBadge(@Param('idOrSlug') idOrSlug: string) {
    return this.badgesService.findByIdOrSlug(idOrSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async createBadge(@Body() dto: CreateBadgeDto) {
    return this.badgesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async updateBadge(
    @Param('id') id: string,
    @Body() dto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async deleteBadge(@Param('id') id: string) {
    return this.badgesService.delete(id);
  }
}

