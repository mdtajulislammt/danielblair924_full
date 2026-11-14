import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChallengeScope,
  ChallengeStatus,
} from '../../generated/prisma/client.js';

export class ChallengeQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @IsOptional()
  @IsEnum(ChallengeScope)
  scope?: ChallengeScope;

  @IsOptional()
  @IsString()
  search?: string;
}
