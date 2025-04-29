import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  photo: string;

  @IsArray()
  @IsString({ each: true })
  itemsSupplied: string[];

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  brands: string[];
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  photo?: string;

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