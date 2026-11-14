import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { UploadProofImagesDto } from './dto/upload-proof-images.dto.js';
import { FinalizeSubmissionDto } from './dto/finalize-submission.dto.js';
import { SubmissionQueryDto } from './dto/submission-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('draft')
  async createDraft(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionsService.createDraft(userId, dto);
  }

  @Post()
  async createSubmission(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionsService.createDraft(userId, dto);
  }

  @Post(':id/proof-images')
  async uploadProofImages(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() dto: UploadProofImagesDto,
  ) {
    return this.submissionsService.uploadProofImages(userId, id, dto, userRole);
  }

  @Post(':id/finalize')
  async finalizeSubmission(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() dto: FinalizeSubmissionDto,
  ) {
    return this.submissionsService.finalizeSubmission(userId, id, dto, userRole);
  }

  @Get('my')
  async getMySubmissions(
    @CurrentUser('id') userId: string,
    @Query() query: SubmissionQueryDto,
  ) {
    return this.submissionsService.getMySubmissions(userId, query);
  }

  @Get(':id/finisher-card')
  async getFinisherCard(@Param('id') id: string) {
    return this.submissionsService.getFinisherCard(id);
  }

  @Get(':id')
  async getSubmissionById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.submissionsService.getSubmissionById(id, user);
  }
}

