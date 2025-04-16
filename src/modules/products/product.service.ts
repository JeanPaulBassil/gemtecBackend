import { Injectable } from '@nestjs/common';
import { Product, ProductImage, CreateProductDto, UpdateProductDto } from './product.types';

@Injectable()
export class ProductService {
  private products: Product[] = [];
  private productImages: ProductImage[] = [];

  constructor() {
    // Initialize with some example data
    const id = this.generateId();
    const now = new Date();
    this.products.push({
      id,
      name: 'Example Product',
      subtitle: 'An example product',
      specifications: 'Some specifications',
      certificates: 'Some certificates',
      generalFeatures: 'Some general features',
      createdAt: now,
      updatedAt: now,
    });

    const imageId = this.generateId();
    this.productImages.push({
      id: imageId,
      productId: id,
      imageUrl: 'https://example.com/image.jpg',
      altText: 'Example image',
      order: 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  create(data: CreateProductDto): Product {
    const now = new Date();
    const id = this.generateId();
    
    const newProduct: Product = {
      id,
      name: data.name,
      subtitle: data.subtitle,
      specifications: data.specifications,
      certificates: data.certificates,
      generalFeatures: data.generalFeatures,
      createdAt: now,
      updatedAt: now,
      images: [],
    };
    
    this.products.push(newProduct);

    // Handle image creation if provided
    if (data.images?.create) {
      const newImages = data.images.create.map(imageData => {
        const imageId = this.generateId();
        return {
          id: imageId,
          productId: id,
          imageUrl: imageData.imageUrl,
          altText: imageData.altText,
          order: imageData.order,
          createdAt: now,
          updatedAt: now,
        };
      });
      
      this.productImages.push(...newImages);
      newProduct.images = newImages;
    }

    return newProduct;
  }

  findAll(): Product[] {
    return this.products.map(product => ({
      ...product,
      images: this.productImages.filter(image => image.productId === product.id),
    }));
  }

  findOne(id: string): Product | null {
    const product = this.products.find(p => p.id === id);
    if (!product) return null;

    return {
      ...product,
      images: this.productImages.filter(image => image.productId === id),
    };
  }

  update(id: string, data: UpdateProductDto): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const now = new Date();
    // Create a copy of the product without including the images from data
    const { images: _, ...dataWithoutImages } = data;
    const updatedProduct = {
      ...this.products[index],
      ...dataWithoutImages,
      updatedAt: now,
    };

    this.products[index] = updatedProduct;

    // Handle image creation if provided
    if (data.images?.create) {
      const newImages = data.images.create.map(imageData => {
        const imageId = this.generateId();
        return {
          id: imageId,
          productId: id,
          imageUrl: imageData.imageUrl,
          altText: imageData.altText,
          order: imageData.order,
          createdAt: now,
          updatedAt: now,
        };
      });
      
      this.productImages.push(...newImages);
    }

    // Handle image deletion if provided
    if (data.images?.deleteMany) {
      this.productImages = this.productImages.filter(image => {
        return !data.images?.deleteMany?.some(deleteImage => 
          deleteImage.id === image.id && image.productId === id
        );
      });
    }

    return {
      ...updatedProduct,
      images: this.productImages.filter(image => image.productId === id),
    };
  }

  remove(id: string): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const deletedProduct = this.products[index];
    
    // Remove the product
    this.products.splice(index, 1);
    
    // Remove associated images
    this.productImages = this.productImages.filter(image => image.productId !== id);

    return deletedProduct;
  }
}
