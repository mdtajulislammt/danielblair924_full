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
import { ChallengesService } from './challenges.service.js';
import { ChallengeQueryDto } from './dto/challenge-query.dto.js';
import { CreateChallengeDto } from './dto/create-challenge.dto.js';
import { UpdateChallengeDto } from './dto/update-challenge.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('admin/challenges')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AdminChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async getChallenges(@Query() query: ChallengeQueryDto) {
    return this.challengesService.getChallenges(query);
  }

  @Get(':id')
  async getChallengeById(@Param('id') id: string) {
    return this.challengesService.getChallengeById(id);
  }

  @Get(':id/destinations')
  async getDestinations(@Param('id') id: string) {
    return this.challengesService.getDestinations(id);
  }

  @Get(':id/participants')
  async getParticipants(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.challengesService.getChallengeParticipants(id, page, limit);
  }

  @Post()
  async createChallenge(@Body() dto: CreateChallengeDto) {
    return this.challengesService.createChallenge(dto);
  }

  @Patch(':id')
  async updateChallenge(
    @Param('id') id: string,
    @Body() dto: UpdateChallengeDto,
  ) {
    return this.challengesService.updateChallenge(id, dto);
  }

  @Delete(':id')
  async deleteChallenge(@Param('id') id: string) {
    return this.challengesService.deleteChallenge(id);
  }
}

