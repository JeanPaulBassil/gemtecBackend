import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class JobIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
} 