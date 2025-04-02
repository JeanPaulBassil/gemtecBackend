import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class QuoteIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
} 