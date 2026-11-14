import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EventRequirementsDto {
  @IsOptional()
  @IsBoolean()
  completeDistance?: boolean = true;

  @IsOptional()
  @IsBoolean()
  uploadRunningEvidence?: boolean = true;

  @IsOptional()
  @IsBoolean()
  postOnTikTok?: boolean = true;

  @IsOptional()
  @IsString()
  tiktokCaptionInstructions?: string;

  @IsOptional()
  @IsBoolean()
  tagFirstMileClub?: boolean = true;

  @IsOptional()
  @IsBoolean()
  tagCollaboratingPage?: boolean = false;

  @IsOptional()
  @IsString()
  collaboratingPageName?: string;

  @IsOptional()
  @IsBoolean()
  useSpecificHashtag?: boolean = true;

  @IsOptional()
  @IsString()
  specificHashtag?: string;
}

