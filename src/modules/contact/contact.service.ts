import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ContactForm } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactForm> {
    return this.prisma.contactForm.create({
      data,
    });
  }

  async findAll(): Promise<ContactForm[]> {
    return this.prisma.contactForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<ContactForm | null> {
    return this.prisma.contactForm.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<ContactForm> {
    return this.prisma.contactForm.delete({
      where: { id },
    });
  }

  async updateReadStatus(id: string, isRead: boolean): Promise<ContactForm> {
    return this.prisma.contactForm.update({
      where: { id },
      data: { isRead },
    });
  }
} 