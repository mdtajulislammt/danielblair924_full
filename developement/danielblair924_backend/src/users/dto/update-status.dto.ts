import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../generated/prisma/client.js';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatus, {
    message: 'Status must be one of ACTIVE, INACTIVE, SUSPENDED',
  })
  status!: UserStatus;
}

