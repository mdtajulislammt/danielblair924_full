import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionQueryDto } from './dto/submission-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('runner')
@UseGuards(JwtAuthGuard)
export class RunnerController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.submissionsService.getRunnerDashboard(userId);
  }

  @Get('activities')
  async getActivities(
    @CurrentUser('id') userId: string,
    @Query() query: SubmissionQueryDto,
  ) {
    return this.submissionsService.getMySubmissions(userId, query);
  }
}

