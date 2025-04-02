import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateQuoteDto {
  @IsBoolean()
  @IsOptional()
  isSeen?: boolean;
} 