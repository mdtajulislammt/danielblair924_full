import { IsOptional, IsString } from 'class-validator';

export class UpdateShippingDto {
  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  recipient_name?: string;

  @IsOptional()
  @IsString()
  recipientZipCode?: string;

  @IsOptional()
  @IsString()
  recipient_zip_code?: string;

  @IsOptional()
  @IsString()
  recipientCountry?: string;

  @IsOptional()
  @IsString()
  recipient_country?: string;

  @IsOptional()
  @IsString()
  recipientState?: string;

  @IsOptional()
  @IsString()
  recipient_state?: string;

  @IsOptional()
  @IsString()
  recipientCity?: string;

  @IsOptional()
  @IsString()
  recipient_city?: string;

  @IsOptional()
  @IsString()
  recipientAddress?: string;

  @IsOptional()
  @IsString()
  recipient_address?: string;

  @IsOptional()
  @IsString()
  recipientPhoneNumber?: string;

  @IsOptional()
  @IsString()
  recipient_phone_number?: string;
}

