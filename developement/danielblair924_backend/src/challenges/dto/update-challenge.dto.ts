import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChallengeScope,
  ChallengeStatus,
} from '../../generated/prisma/client.js';
import { EventRequirementsDto } from '../../events/dto/event-requirements.dto.js';

export class UpdateChallengeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  challengeName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(ChallengeScope)
  scope?: ChallengeScope;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  targetProgress?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  currentProgress?: number;

  @IsOptional()
  @IsString()
  progressUnit?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventRequirementsDto)
  requirements?: EventRequirementsDto;
}
