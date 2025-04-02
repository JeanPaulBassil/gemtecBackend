import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteRequest } from '@prisma/client';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteIdDto } from './dto/quote-id.dto';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<QuoteRequest> {
    return this.quoteService.create(createQuoteDto);
  }

  @Get()
  async findAll(): Promise<QuoteRequest[]> {
    return this.quoteService.findAll();
  }

  @Get(':id')
  async findOne(@Param() { id }: QuoteIdDto): Promise<QuoteRequest | null> {
    return this.quoteService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param() { id }: QuoteIdDto,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ): Promise<QuoteRequest> {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  async delete(@Param() { id }: QuoteIdDto): Promise<QuoteRequest> {
    return this.quoteService.delete(id);
  }
} 