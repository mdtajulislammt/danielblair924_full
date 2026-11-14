import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  newSubmissionAlert?: boolean;

  @IsOptional()
  @IsBoolean()
  newRegistrationAlert?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklySummaryEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  eventPublishedConfirmation?: boolean;

  @IsOptional()
  @IsBoolean()
  badgeEarnedNotifications?: boolean;
}

