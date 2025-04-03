import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { Application, Resume } from "@prisma/client";

@Controller("applications")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async create(
    @Body()
    data: {
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
    },
  ): Promise<Application> {
    return this.applicationService.create(data);
  }

  @Get()
  async findAll(): Promise<Application[]> {
    return this.applicationService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Application | null> {
    return this.applicationService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: { isSeen?: boolean },
  ): Promise<Application> {
    return this.applicationService.update(id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<Application> {
    return this.applicationService.delete(id);
  }

  @Put(":id/resume")
  async updateResume(
    @Param("id") applicationId: string,
    @Body() data: { fileUrl: string },
  ): Promise<Resume> {
    return this.applicationService.updateResume(applicationId, data.fileUrl);
  }

  @Delete(":id/resume")
  async deleteResume(@Param("id") id: string): Promise<Resume> {
    return this.applicationService.deleteResume(id);
  }
}
