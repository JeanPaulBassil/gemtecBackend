import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { PrismaService } from "../../common/services/prisma.service";

@Module({
  controllers: [NewsController],
  providers: [NewsService, PrismaService],
  exports: [NewsService],
})
export class NewsModule {}
