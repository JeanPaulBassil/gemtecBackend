import { IsString, IsEmail, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  currentLocation: string;

  @IsNumber()
  yearsOfExperience: number;

  @IsString()
  highestEducation: string;

  @IsString()
  coverLetter: string;

  @IsString()
  positionId: string;

  @IsOptional()
  @IsObject()
  resume?: {
    fileUrl: string;
  };
} 