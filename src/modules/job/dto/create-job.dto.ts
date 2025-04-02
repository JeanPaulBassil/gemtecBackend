import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { RequirementDto } from './requirement.dto';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  cityName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  countryName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  positionType: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  department: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequirementDto)
  requirements?: RequirementDto[];
} 