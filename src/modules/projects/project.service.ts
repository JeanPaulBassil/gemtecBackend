import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from './project.types';

@Injectable()
export class ProjectService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createProjectDto: CreateProjectDto) {
    return await this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        photoUrl: createProjectDto.photo,
        itemsSupplied: createProjectDto.itemsSupplied,
        location: createProjectDto.location,
        brands: createProjectDto.brands,
      },
    });
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

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const data = {};
      if (updateProjectDto.title) data['title'] = updateProjectDto.title;
      if (updateProjectDto.photo) data['photoUrl'] = updateProjectDto.photo;
      if (updateProjectDto.itemsSupplied) data['itemsSupplied'] = updateProjectDto.itemsSupplied;
      if (updateProjectDto.location) data['location'] = updateProjectDto.location;
      if (updateProjectDto.brands) data['brands'] = updateProjectDto.brands;

      return await this.prisma.project.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
} 