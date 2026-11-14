import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BadgeTagType } from '../../generated/prisma/enums.js';

export class CreateBadgeDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Badge name must be at least 2 characters.' })
  @MaxLength(50, { message: 'Badge name must not exceed 50 characters.' })
  name?: string;

  /** Alias accepted from frontend title field */
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Badge name must be at least 2 characters.' })
  @MaxLength(50, { message: 'Badge name must not exceed 50 characters.' })
  title?: string;

  @IsNotEmpty({ message: 'Description is required.' })
  @IsString()
  @MinLength(5, { message: 'Description must be at least 5 characters.' })
  @MaxLength(250, { message: 'Description must not exceed 250 characters.' })
  description!: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  /** Alias if uploaded as icon string */
  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsEnum(BadgeTagType)
  tagType?: BadgeTagType;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  slug?: string;
}

