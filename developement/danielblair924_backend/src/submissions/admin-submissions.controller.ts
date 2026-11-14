import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { SubmissionQueryDto } from './dto/submission-query.dto.js';
import { RejectSubmissionDto } from './dto/reject-submission.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('admin/submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async getSubmissions(@Query() query: SubmissionQueryDto) {
    return this.submissionsService.getAdminSubmissions(query);
  }

  @Get(':id')
  async getSubmissionDetail(@Param('id') id: string) {
    return this.submissionsService.getSubmissionById(id);
  }

  @Patch(':id/approve')
  async approveSubmission(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.submissionsService.approveSubmission(id, adminId);
  }

  @Patch(':id/reject')
  async rejectSubmission(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: RejectSubmissionDto,
  ) {
    return this.submissionsService.rejectSubmission(id, adminId, dto);
  }
}

