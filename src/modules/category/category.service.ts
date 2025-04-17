import { Injectable } from '@nestjs/common';
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryTreeResponse } from './category.types';

@Injectable()
export class CategoryService {
  private categories: Category[] = [];

  constructor() {
    // Initialize with some example data
    const now = new Date();
    
    // Parent category
    const parentId = this.generateId();
    this.categories.push({
      id: parentId,
      name: 'Air Control Equipments',
      slug: 'air-control-equipments',
      parentId: null,
      createdAt: now,
      updatedAt: now,
    });
    
    // Subcategory
    const childId = this.generateId();
    this.categories.push({
      id: childId,
      name: 'Draught Shutters',
      slug: 'draught-shutters',
      parentId: parentId,
      createdAt: now,
      updatedAt: now,
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  create(data: CreateCategoryDto): Category {
    const now = new Date();
    const id = this.generateId();
    
    const slug = data.slug || this.generateSlug(data.name);
    
    // Verify slug uniqueness
    if (this.categories.some(cat => cat.slug === slug)) {
      throw new Error('Category slug must be unique');
    }
    
    const newCategory: Category = {
      id,
      name: data.name,
      slug,
      parentId: data.parentId || null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.categories.push(newCategory);

    return newCategory;
  }

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: string): Category | null {
    return this.categories.find(c => c.id === id) || null;
  }

  findBySlug(slug: string): Category | null {
    return this.categories.find(c => c.slug === slug) || null;
  }

  update(id: string, data: UpdateCategoryDto): Category | null {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const now = new Date();
    
    // Check slug uniqueness if updating slug
    if (data.slug && this.categories.some(cat => cat.slug === data.slug && cat.id !== id)) {
      throw new Error('Category slug must be unique');
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...data,
      updatedAt: now,
    };

    this.categories[index] = updatedCategory;

    return updatedCategory;
  }

  remove(id: string): Category | null {
    // Check if category has children
    if (this.categories.some(cat => cat.parentId === id)) {
      throw new Error('Cannot delete category with subcategories');
    }
    
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const deletedCategory = this.categories[index];
    
    // Remove the category
    this.categories.splice(index, 1);
    
    return deletedCategory;
  }

  // Get direct children of a category
  findChildren(parentId: string): Category[] {
    return this.categories.filter(c => c.parentId === parentId);
  }

  // Get top-level categories
  findTopLevelCategories(): Category[] {
    return this.categories.filter(c => !c.parentId);
  }

  // Build a category tree (recursive structure)
  buildCategoryTree(): CategoryTreeResponse[] {
    const topLevelCategories = this.findTopLevelCategories();
    
    const buildTree = (parentId: string): CategoryTreeResponse[] => {
      const children = this.findChildren(parentId);
      
      return children.map(child => ({
        ...child,
        children: buildTree(child.id)
      }));
    };
    
    return topLevelCategories.map(category => ({
      ...category,
      children: buildTree(category.id)
    }));
  }
} 