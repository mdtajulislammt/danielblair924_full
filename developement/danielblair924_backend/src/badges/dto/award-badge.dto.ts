import { IsNotEmpty, IsString } from 'class-validator';

export class AwardBadgeDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString()
  userId!: string;
}

