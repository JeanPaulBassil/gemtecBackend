import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { QuoteRequest } from '@prisma/client';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    phoneNumber: string;
    productCategory: string;
    productType: string;
    description: string;
    isSeen?: boolean;
  }): Promise<QuoteRequest> {
    return this.prisma.quoteRequest.create({
      data: {
        ...data,
        isSeen: data.isSeen ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });
  }

  async findAll(): Promise<QuoteRequest[]> {
    return this.prisma.quoteRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<QuoteRequest | null> {
    return this.prisma.quoteRequest.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: {
      isSeen?: boolean;
    },
  ): Promise<QuoteRequest> {
    return this.prisma.quoteRequest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<QuoteRequest> {
    return this.prisma.quoteRequest.delete({
      where: { id },
    });
  }
} 