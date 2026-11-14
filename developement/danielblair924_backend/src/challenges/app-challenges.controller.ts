import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service.js';
import { ChallengeQueryDto } from './dto/challenge-query.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ChallengeStatus } from '../generated/prisma/client.js';

@Controller('app/challenges')
@UseGuards(JwtAuthGuard)
export class AppChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('ratw/destinations')
  async getRatwDestinations() {
    return this.challengesService.getDestinations();
  }

  @Get()
  async getChallenges(
    @Query() query: ChallengeQueryDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.challengesService.getChallenges(
      query,
      ChallengeStatus.ACTIVE,
      userId,
    );
  }

  @Get(':id')
  async getChallengeById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.challengesService.getChallengeById(id, userId);
  }

  @Get(':id/destinations')
  async getDestinations(@Param('id') id: string) {
    return this.challengesService.getDestinations(id);
  }

  @Post(':id/join')
  async joinChallenge(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.challengesService.joinChallenge(id, userId);
  }
}
