import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { JobOffering, Requirement, Application } from "@prisma/client";

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    cityName: string;
    countryName: string;
    positionType: string;
    department: string;
    requirements?: { title: string }[];
  }): Promise<JobOffering> {
    const { requirements, ...jobData } = data;

    return this.prisma.jobOffering.create({
      data: {
        ...jobData,
        requirements: requirements
          ? {
              create: requirements,
            }
          : undefined,
      },
      include: {
        requirements: true,
      },
    });
  }

  async findAll(): Promise<JobOffering[]> {
    return this.prisma.jobOffering.findMany({
      include: {
        requirements: true,
        applications: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string): Promise<JobOffering | null> {
    return this.prisma.jobOffering.findUnique({
      where: { id },
      include: {
        requirements: true,
        applications: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      cityName?: string;
      countryName?: string;
      positionType?: string;
      department?: string;
    },
  ): Promise<JobOffering> {
    return this.prisma.jobOffering.update({
      where: { id },
      data,
      include: {
        requirements: true,
        applications: true,
      },
    });
  }

  async delete(id: string): Promise<JobOffering> {
    // First get all applications for this job
    const applications = await this.prisma.application.findMany({
      where: { positionId: id },
      include: { resume: true }
    });

    // Delete resumes for all applications
    for (const application of applications) {
      if (application.resume) {
        await this.prisma.resume.delete({
          where: { applicationId: application.id }
        });
      }
    }

    // Delete all applications
    await this.prisma.application.deleteMany({
      where: { positionId: id }
    });

    // Delete all requirements
    await this.prisma.requirement.deleteMany({
      where: { positionId: id }
    });

    // Finally delete the job offering
    return this.prisma.jobOffering.delete({
      where: { id },
      include: {
        requirements: true,
        applications: true
      }
    });
  }

  // Requirements related methods
  async addRequirement(jobId: string, title: string): Promise<Requirement> {
    return this.prisma.requirement.create({
      data: {
        title,
        position: {
          connect: { id: jobId },
        },
      },
    });
  }

  async removeRequirement(id: string): Promise<Requirement> {
    return this.prisma.requirement.delete({
      where: { id },
    });
  }

  // Application related methods
  async getApplications(jobId: string): Promise<Application[]> {
    return this.prisma.application.findMany({
      where: { positionId: jobId },
      orderBy: { createdAt: "desc" },
    });
  }
}
