import {
  IsEnum,
  IsNotEmpty,
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

export class CreateChallengeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  challengeName?: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  type?: string; // e.g. "Community-wide" or "Individual"

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
  targetProgress?: number = 500;

  @IsOptional()
  @IsString()
  progressUnit?: string = 'km';

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
