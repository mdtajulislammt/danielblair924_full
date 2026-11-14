import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateNewsDto {
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  @MaxLength(120, { message: 'Title must not exceed 120 characters.' })
  title!: string;

  @IsNotEmpty({ message: 'Post content must be at least 10 characters long.' })
  @IsString()
  @MinLength(10, { message: 'Post content must be at least 10 characters long.' })
  body!: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  /** Alias accepted if submitted via JSON body */
  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  publishDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isDraft?: boolean;
}

