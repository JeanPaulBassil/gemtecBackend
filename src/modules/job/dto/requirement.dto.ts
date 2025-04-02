import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RequirementDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;
} 