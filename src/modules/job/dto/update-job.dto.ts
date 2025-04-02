import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  cityName?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  countryName?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  positionType?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  department?: string;
} 