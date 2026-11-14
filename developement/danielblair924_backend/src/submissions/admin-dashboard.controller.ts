import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminDashboardController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.submissionsService.getAdminDashboardStats();
  }

  @Get('recent-activity')
  async getRecentActivity() {
    return this.submissionsService.getAdminRecentActivity();
  }
}

