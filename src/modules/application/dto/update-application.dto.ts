import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsBoolean()
  isSeen?: boolean;
} 