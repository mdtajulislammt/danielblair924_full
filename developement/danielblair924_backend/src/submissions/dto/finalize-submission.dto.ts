import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FinalizeSubmissionDto {
  @IsOptional()
  @IsBoolean()
  postedOnTikTok?: boolean;

  @IsOptional()
  @IsString()
  tiktokVideoUrl?: string;

  @IsOptional()
  @IsBoolean()
  taggedClub?: boolean;

  @IsOptional()
  @IsBoolean()
  usedHashtag?: boolean;

  @IsOptional()
  @IsString()
  specificHashtagUsed?: string;
}

