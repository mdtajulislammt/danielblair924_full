import {
  Body,
  Controller,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('ratw/destinations')
  async getRatwDestinations() {
    return this.challengesService.getDestinations();
  }

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

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinChallenge(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.challengesService.joinChallenge(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async createChallenge(@Body() dto: CreateChallengeDto) {
    return this.challengesService.createChallenge(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async updateChallenge(
    @Param('id') id: string,
    @Body() dto: UpdateChallengeDto,
  ) {
    return this.challengesService.updateChallenge(id, dto);
  }
}

