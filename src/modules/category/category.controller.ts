import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.types';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() data: CreateCategoryDto) {
    try {
      return this.categoryService.create(data);
    } catch (error) {
      throw new HttpException(`Failed to create category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll(@Query('tree') tree?: string) {
    try {
      // If tree=true is passed as a query parameter, return tree structure
      if (tree === 'true') {
        return this.categoryService.buildCategoryTree();
      }
      
      return this.categoryService.findAll();
    } catch (error) {
      throw new HttpException(`Failed to get categories: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('top-level')
  findTopLevel() {
    try {
      return this.categoryService.findTopLevelCategories();
    } catch (error) {
      throw new HttpException(`Failed to get top-level categories: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    try {
      // Try to find by ID first
      let category = this.categoryService.findOne(idOrSlug);
      
      // If not found, try by slug
      if (!category) {
        category = this.categoryService.findBySlug(idOrSlug);
      }
      
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to get category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/children')
  findChildren(@Param('id') id: string) {
    try {
      // Check if the parent exists
      const parent = this.categoryService.findOne(id);
      if (!parent) {
        throw new HttpException('Parent category not found', HttpStatus.NOT_FOUND);
      }
      
      return this.categoryService.findChildren(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to get subcategories: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    try {
      const category = this.categoryService.update(id, data);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to update category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a category and all its subcategories recursively
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const category = this.categoryService.remove(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return {
        ...category,
        message: 'Category and all its subcategories were deleted successfully'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to delete category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 