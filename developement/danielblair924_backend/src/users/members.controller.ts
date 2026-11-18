import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('members')
export class MembersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('leaderboard')
  async getLeaderboard(
    @Query('filter') filter?: string,
    @Query('limit') limit?: number,
    @CurrentUser('id') userId?: string,
  ) {
    return this.usersService.getLeaderboard(filter, userId, limit);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getMyStats(@CurrentUser('id') userId: string) {
    return this.usersService.getMemberStats(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMemberById(@Param('id') id: string) {
    return this.usersService.findMemberById(id);
  }
}

