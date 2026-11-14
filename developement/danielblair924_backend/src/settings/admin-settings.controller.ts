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
import { UpdateAdminAccountDto } from './dto/update-admin-account.dto.js';
import { UpdateNotificationSettingsDto } from './dto/update-notifications.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * GET /api/admin/settings
   * Retrieve admin profile, notification toggles, and security sessions.
   */
  @Get()
  async getSettings(@CurrentUser('id') userId: string) {
    return this.settingsService.getAdminSettings(userId);
  }

  /**
   * PATCH /api/admin/settings/account
   * Update admin profile details and password with validation.
   */
  @Patch('account')
  async updateAccount(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAdminAccountDto,
  ) {
    return this.settingsService.updateAdminAccount(userId, dto);
  }

  /**
   * PATCH /api/admin/settings/notifications
   * Update admin alert notification preferences.
   */
  @Patch('notifications')
  async updateNotifications(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.settingsService.updateNotifications(userId, dto);
  }

  /**
   * GET /api/admin/settings/sessions
   * List active logged-in browser device sessions.
   */
  @Get('sessions')
  async getSessions(@CurrentUser('id') userId: string) {
    return this.settingsService.getActiveSessions(userId);
  }

  /**
   * DELETE /api/admin/settings/sessions/:id
   * Revoke a specific active browser device session.
   */
  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.settingsService.revokeSession(userId, sessionId);
  }
}

