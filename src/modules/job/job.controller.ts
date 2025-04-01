import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { JobOffering, Requirement, Application } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(
    @Body()
    data: {
      title: string;
      cityName: string;
      countryName: string;
      positionType: string;
      department: string;
      requirements?: { title: string }[];
    },
  ): Promise<JobOffering> {
    return this.jobService.create(data);
  }

  @Get()
  async findAll(): Promise<JobOffering[]> {
    return this.jobService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobOffering | null> {
    return this.jobService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    data: {
      title?: string;
      cityName?: string;
      countryName?: string;
      positionType?: string;
      department?: string;
    },
  ): Promise<JobOffering> {
    return this.jobService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<JobOffering> {
    return this.jobService.delete(id);
  }

  @Post(':id/requirements')
  async addRequirement(
    @Param('id') jobId: string,
    @Body() data: { title: string },
  ): Promise<Requirement> {
    return this.jobService.addRequirement(jobId, data.title);
  }

  @Delete('requirements/:id')
  async removeRequirement(@Param('id') id: string): Promise<Requirement> {
    return this.jobService.removeRequirement(id);
  }

  @Get(':id/applications')
  async getApplications(@Param('id') jobId: string): Promise<Application[]> {
    return this.jobService.getApplications(jobId);
  }
} 