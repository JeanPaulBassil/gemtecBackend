import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService, PrismaService],
  exports: [QuoteService],
})
export class QuoteModule {} 