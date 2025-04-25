import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactForm } from '@prisma/client';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto): Promise<ContactForm> {
    return this.contactService.create(createContactDto);
  }

  @Get()
  async findAll(): Promise<ContactForm[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ContactForm | null> {
    return this.contactService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ContactForm> {
    return this.contactService.delete(id);
  }

  @Patch(':id/read-status')
  async updateReadStatus(
    @Param('id') id: string,
    @Body() data: { isRead: boolean }
  ): Promise<ContactForm> {
    return this.contactService.updateReadStatus(id, data.isRead);
  }
} 