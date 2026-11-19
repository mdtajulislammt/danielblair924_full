import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class DeviceTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsIn(['ios', 'android', 'web'])
  platform: string;
}

export class UnregisterTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

