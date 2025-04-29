import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  // Temporarily removed JwtAuthGuard for testing
  async create(@Body() createProjectDto: any) {
    console.log('Controller received:', createProjectDto);
    return await this.projectService.create(createProjectDto);
  }

  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  @Patch(':id')
  // Temporarily removed JwtAuthGuard for testing
  async update(@Param('id') id: string, @Body() updateProjectDto: any) {
    console.log('Controller received update:', updateProjectDto);
    return await this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  // Temporarily removed JwtAuthGuard for testing
  async remove(@Param('id') id: string) {
    console.log('Controller received delete request for ID:', id);
    return await this.projectService.remove(id);
  }
} 