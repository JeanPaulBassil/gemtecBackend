import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  itemsSupplied?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  brands?: string[];
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
  
  @IsString()
  @IsOptional()
  photo?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  itemsSupplied?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  brands?: string[];
}

export interface ProjectResponse {
  id: string;
  title: string;
  photoUrl: string;
  itemsSupplied: string[];
  location: string;
  brands: string[];
  createdAt: Date;
  updatedAt: Date;
} 