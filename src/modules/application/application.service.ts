import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Application, Resume } from '@prisma/client';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

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
    resume?: {
      fileUrl: string;
    };
  }): Promise<Application> {
    const { resume, ...applicationData } = data;
    return this.prisma.application.create({
      data: {
        ...applicationData,
        resume: resume
          ? {
              create: resume,
            }
          : undefined,
      },
      include: {
        resume: true,
        position: true,
      },
    });
  }

  async findAll(): Promise<Application[]> {
    return this.prisma.application.findMany({
      include: {
        resume: true,
        position: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Application | null> {
    return this.prisma.application.findUnique({
      where: { id },
      include: {
        resume: true,
        position: true,
      },
    });
  }

  async update(id: string, data: {
    isSeen?: boolean;
  }): Promise<Application> {
    return this.prisma.application.update({
      where: { id },
      data,
      include: {
        resume: true,
        position: true,
      },
    });
  }

  async delete(id: string): Promise<Application> {
    return this.prisma.application.delete({
      where: { id },
      include: {
        resume: true,
      },
    });
  }

  // Resume related methods
  async updateResume(applicationId: string, fileUrl: string): Promise<Resume> {
    return this.prisma.resume.upsert({
      where: {
        applicationId,
      },
      update: {
        fileUrl,
      },
      create: {
        fileUrl,
        application: {
          connect: { id: applicationId },
        },
      },
    });
  }

  async deleteResume(id: string): Promise<Resume> {
    return this.prisma.resume.delete({
      where: { id },
    });
  }
} 