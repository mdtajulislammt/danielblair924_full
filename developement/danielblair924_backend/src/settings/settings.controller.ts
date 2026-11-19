import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { UpdateNotificationSettingsDto } from './dto/update-notifications.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * GET /api/settings/notifications
   * Get user notification preferences.
   */
  @Get('notifications')
  async getNotifications(@CurrentUser('id') userId: string) {
    return this.settingsService.getNotifications(userId);
  }

  /**
   * PATCH /api/settings/notifications
   * Update user notification preferences.
   */
  @Patch('notifications')
  async updateNotifications(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.settingsService.updateNotifications(userId, dto);
  }

  /**
   * GET /api/settings/sessions
   * List active sessions for the current authenticated user.
   */
  @Get('sessions')
  async getSessions(
    @CurrentUser('id') userId: string,
    @CurrentUser('sid') sid?: string,
  ) {
    return this.settingsService.getActiveSessions(userId, sid);
  }

  /**
   * DELETE /api/settings/sessions
   * Revoke all other active sessions except current.
   */
  @Delete('sessions')
  async revokeOtherSessions(
    @CurrentUser('id') userId: string,
    @CurrentUser('sid') sid?: string,
  ) {
    return this.settingsService.deleteOtherSessions(userId, sid);
  }

  /**
   * DELETE /api/settings/sessions/:id
   * Revoke an active session.
   */
  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser('id') userId: string,
    @CurrentUser('sid') sid: string | undefined,
    @Param('id') sessionId: string,
  ) {
    return this.settingsService.revokeSession(userId, sessionId, sid);
  }
}

