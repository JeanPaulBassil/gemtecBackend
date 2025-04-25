import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { JobService } from "./job.service";
import { JobOffering, Requirement, Application } from "@prisma/client";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobIdDto } from "./dto/job-id.dto";
import { RequirementDto } from "./dto/requirement.dto";

@Controller("job-offerings")
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto): Promise<JobOffering> {
    console.log("createJobDto", createJobDto);
    return this.jobService.create(createJobDto);
  }

  @Get()
  async findAll(): Promise<JobOffering[]> {
    return this.jobService.findAll();
  }

  @Get(":id")
  async findOne(@Param() { id }: JobIdDto): Promise<JobOffering | null> {
    return this.jobService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param() { id }: JobIdDto,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<JobOffering> {
    return this.jobService.update(id, updateJobDto);
  }

  @Delete(":id")
  async delete(@Param() { id }: JobIdDto): Promise<JobOffering> {
    return this.jobService.delete(id);
  }

  @Post(":id/requirements")
  async addRequirement(
    @Param() { id }: JobIdDto,
    @Body() requirementDto: RequirementDto,
  ): Promise<Requirement> {
    console.log("requirementDto", requirementDto);
    return this.jobService.addRequirement(id, requirementDto.title);
  }

  @Delete("requirements/:id")
  async removeRequirement(@Param() { id }: JobIdDto): Promise<Requirement> {
    return this.jobService.removeRequirement(id);
  }

  @Get(":id/applications")
  async getApplications(@Param() { id }: JobIdDto): Promise<Application[]> {
    return this.jobService.getApplications(id);
  }
}
