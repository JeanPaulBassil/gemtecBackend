import { IsString } from 'class-validator';

export class UpdateResumeDto {
  @IsString()
  fileUrl: string;
} 