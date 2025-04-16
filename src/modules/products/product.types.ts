// Define Product and ProductImage types that match the schema
export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  specifications?: string;
  certificates?: string;
  generalFeatures?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
}

// Define types to match the controller
export type CreateProductDto = {
  name: string;
  subtitle?: string;
  specifications?: string;
  certificates?: string;
  generalFeatures?: string;
  images?: {
    create?: {
      imageUrl: string;
      altText?: string;
      order?: number;
    }[];
  };
};

export type UpdateProductDto = {
  name?: string;
  subtitle?: string;
  specifications?: string;
  certificates?: string;
  generalFeatures?: string;
  images?: {
    create?: {
      imageUrl: string;
      altText?: string;
      order?: number;
    }[];
    deleteMany?: {
      id?: string;
    }[];
  };
}; 