import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StravaExchangeTokenDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  scope?: string;
}

export class StravaWebhookEventDto {
  object_type: 'activity' | 'athlete';
  object_id: number;
  aspect_type: 'create' | 'update' | 'delete';
  owner_id: number;
  subscription_id: number;
  event_time: number;
  updates?: Record<string, any>;
}

