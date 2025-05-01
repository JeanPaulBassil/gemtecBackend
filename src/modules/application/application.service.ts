import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { Application } from "@prisma/client";

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    currentLocation: string;
    yearsOfExperience: number;
    highestEducation: string;
    coverLetter: string;
    positionId: string;
  }): Promise<Application> {
    try {
      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email || !data.phoneNumber || 
          !data.currentLocation || !data.highestEducation || !data.coverLetter || !data.positionId) {
        throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
      }

      // Validate years of experience
      if (typeof data.yearsOfExperience !== 'number' || data.yearsOfExperience < 0) {
        throw new HttpException('Invalid years of experience', HttpStatus.BAD_REQUEST);
      }

      // Check if position exists
      const position = await this.prisma.jobOffering.findUnique({
        where: { id: data.positionId },
      });
      if (!position) {
        throw new HttpException('Position not found', HttpStatus.NOT_FOUND);
      }

      // Create the application
      return await this.prisma.application.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          currentLocation: data.currentLocation,
          yearsOfExperience: data.yearsOfExperience,
          highestEducation: data.highestEducation,
          coverLetter: data.coverLetter,
          positionId: data.positionId,
        },
        include: {
          position: true,
        },
      });
    } catch (error) {
      console.error('Error creating application:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new HttpException(
          'An application with this email already exists for this position',
          HttpStatus.CONFLICT
        );
      }
      if (error.code === 'P2003') {
        throw new HttpException(
          'Invalid position ID',
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        'An error occurred while creating the application',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<Application[]> {
    return this.prisma.application.findMany({
      include: {
        position: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string): Promise<Application | null> {
    return this.prisma.application.findUnique({
      where: { id },
      include: {
        position: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      currentLocation?: string;
      yearsOfExperience?: number;
      highestEducation?: string;
      coverLetter?: string;
      positionId?: string;
      isSeen?: boolean;
    },
  ): Promise<Application> {
    return this.prisma.application.update({
      where: { id },
      data,
      include: {
        position: true,
      },
    });
  }

  async delete(id: string): Promise<Application> {
    return this.prisma.application.delete({
      where: { id },
    });
  }
}
