import { IsOptional, IsString } from 'class-validator';

export class UploadProofImagesDto {
  @IsOptional()
  @IsString()
  stravaImageUrl?: string;

  @IsOptional()
  @IsString()
  gpsImageUrl?: string;
}

