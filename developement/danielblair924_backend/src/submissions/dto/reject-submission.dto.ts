import { IsNotEmpty, IsString } from 'class-validator';

export class RejectSubmissionDto {
  @IsString()
  @IsNotEmpty({ message: 'A rejection reason is required to explain what needs fixing' })
  reason: string;
}

