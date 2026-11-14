import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType } from '../../generated/prisma/client.js';

export class CreateSubmissionDto {
  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsString()
  challengeId?: string;

  @IsOptional()
  @IsEnum(ActivityType)
  activityType?: ActivityType = ActivityType.RUNNING;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  distanceKm: number;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsOptional()
  @IsString()
  pace?: string;

  @IsNotEmpty()
  runDate: string | Date;

  @IsOptional()
  @IsString()
  stravaImageUrl?: string;

  @IsOptional()
  @IsString()
  gpsImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  postedOnTikTok?: boolean;

  @IsOptional()
  @IsBoolean()
  taggedClub?: boolean;

  @IsOptional()
  @IsBoolean()
  usedHashtag?: boolean;
}

