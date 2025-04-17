// Define Category types that match the schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for creating and updating categories
export type CreateCategoryDto = {
  name: string;
  slug: string;
  parentId?: string;
};

export type UpdateCategoryDto = {
  name?: string;
  slug?: string;
  parentId?: string;
};

// Response Types
export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithChildrenResponse = CategoryResponse & {
  children?: CategoryResponse[];
};

export type CategoryTreeResponse = CategoryResponse & {
  children?: CategoryTreeResponse[];
}; 