import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from './project.types';

@Injectable()
export class ProjectService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createProjectDto: any) {
    try {
      console.log('Received project data:', JSON.stringify(createProjectDto, null, 2));
      
      // Handle both formats - the new format from the screenshot and the old format
      if (createProjectDto.title && 
         (createProjectDto.description !== undefined || 
          createProjectDto.imageUrl !== undefined || 
          createProjectDto.date !== undefined)) {
        // New format from the screenshot
        console.log('Using new format to create project');
        return await this.prisma.project.create({
          data: {
            title: createProjectDto.title,
            photoUrl: createProjectDto.imageUrl || '',
            // Initialize arrays with empty values if not provided
            itemsSupplied: [],
            brands: [],
            // Use a default location if not provided
            location: 'Default Location',
          },
        });
      } else {
        // Original format
        console.log('Using original format to create project');
        return await this.prisma.project.create({
          data: {
            title: createProjectDto.title,
            photoUrl: createProjectDto.photo || '',
            itemsSupplied: Array.isArray(createProjectDto.itemsSupplied) ? createProjectDto.itemsSupplied : [],
            location: createProjectDto.location || 'Default Location',
            brands: Array.isArray(createProjectDto.brands) ? createProjectDto.brands : [],
          },
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      
      // Provide more detailed error message
      if (error.code === 'P2021') {
        throw new BadRequestException('Table "Project" does not exist in the database. Please run migrations.');
      } else if (error.message && error.message.includes('Required')) {
        throw new BadRequestException(`Missing required field: ${error.message}`);
      } else {
        throw new BadRequestException(`Failed to create project: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async findAll() {
    return await this.prisma.project.findMany();
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: any) {
    try {
      console.log('Updating project with data:', JSON.stringify(updateProjectDto, null, 2));
      
      const data = {};
      
      // Check which format we're dealing with
      if (updateProjectDto.description !== undefined || 
          updateProjectDto.imageUrl !== undefined || 
          updateProjectDto.date !== undefined) {
        // New format from the screenshot
        console.log('Using new format to update project');
        
        if (updateProjectDto.title) data['title'] = updateProjectDto.title;
        if (updateProjectDto.imageUrl) data['photoUrl'] = updateProjectDto.imageUrl;
        if (updateProjectDto.description) {
          // We don't have a description field in the database model,
          // so we're not storing it, but we acknowledge it was received
          console.log('Received description, but not storing it as it\'s not in the database model');
        }
      } else {
        // Original format
        console.log('Using original format to update project');
        
        if (updateProjectDto.title) data['title'] = updateProjectDto.title;
        if (updateProjectDto.photo) data['photoUrl'] = updateProjectDto.photo;
        if (updateProjectDto.itemsSupplied) {
          data['itemsSupplied'] = Array.isArray(updateProjectDto.itemsSupplied) 
            ? updateProjectDto.itemsSupplied 
            : [];
        }
        if (updateProjectDto.location) data['location'] = updateProjectDto.location;
        if (updateProjectDto.brands) {
          data['brands'] = Array.isArray(updateProjectDto.brands) 
            ? updateProjectDto.brands 
            : [];
        }
      }
      
      console.log('Updating with data:', data);
      
      return await this.prisma.project.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating project:', error);
      
      if (error.code === 'P2025') {
        throw new NotFoundException(`Project with ID ${id} not found`);
      } else if (error.code === 'P2021') {
        throw new BadRequestException('Table "Project" does not exist in the database');
      } else {
        throw new BadRequestException(`Failed to update project: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async remove(id: string) {
    try {
      console.log(`Attempting to delete project with ID: ${id}`);
      
      // First check if the project exists
      const project = await this.prisma.project.findUnique({
        where: { id },
        select: { id: true }
      });
      
      if (!project) {
        console.log(`Project with ID ${id} not found`);
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      
      // Then delete it
      await this.prisma.project.delete({
        where: { id },
      });
      
      console.log(`Successfully deleted project with ID: ${id}`);
      return { message: `Project with ID ${id} successfully deleted` };
    } catch (error) {
      console.error('Error deleting project:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === 'P2025') {
        throw new NotFoundException(`Project with ID ${id} not found`);
      } else if (error.code === 'P2021') {
        throw new BadRequestException('Table "Project" does not exist in the database');
      } else {
        throw new BadRequestException(`Failed to delete project: ${error.message || 'Unknown error'}`);
      }
    }
  }
} 