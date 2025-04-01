import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteRequest } from '@prisma/client';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async create(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      companyName: string;
      phoneNumber: string;
      productCategory: string;
      productType: string;
      description: string;
    },
  ): Promise<QuoteRequest> {
    return this.quoteService.create(data);
  }

  @Get()
  async findAll(): Promise<QuoteRequest[]> {
    return this.quoteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<QuoteRequest | null> {
    return this.quoteService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { isSeen?: boolean },
  ): Promise<QuoteRequest> {
    return this.quoteService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<QuoteRequest> {
    return this.quoteService.delete(id);
  }
} 