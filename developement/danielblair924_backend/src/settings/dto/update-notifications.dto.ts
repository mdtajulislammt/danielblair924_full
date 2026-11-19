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

  // Mobile member push notification preferences
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  submissionUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  newEvents?: boolean;

  @IsOptional()
  @IsBoolean()
  newChallenges?: boolean;

  @IsOptional()
  @IsBoolean()
  newsUpdates?: boolean;
}

