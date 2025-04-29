import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { News, Prisma } from "@prisma/client";

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const { tagIds, ...newsData } = createNewsDto;

    return this.prisma.news.create({
      data: {
        ...newsData,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    categoryId?: string;
    tagId?: string;
    isPublished?: boolean;
  }): Promise<{ news: News[]; total: number }> {
    const { skip, take, categoryId, tagId, isPublished } = params;

    // Build filters
    const where: Prisma.NewsWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      };
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    // Get total count for pagination
    const total = await this.prisma.news.count({ where });

    // Get news with pagination
    const news = await this.prisma.news.findMany({
      skip,
      take,
      where,
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return { news, total };
  }

  async findOne(id: string): Promise<News> {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!news) {
      throw new NotFoundException(`News article with ID ${id} not found`);
    }

    return news;
  }

  async findBySlug(slug: string): Promise<News> {
    const news = await this.prisma.news.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!news) {
      throw new NotFoundException(`News article with slug ${slug} not found`);
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const { tagIds, ...newsData } = updateNewsDto;

    // Check if news exists
    await this.findOne(id);

    // Update news with optional tag changes
    return this.prisma.news.update({
      where: { id },
      data: {
        ...newsData,
        tags: tagIds
          ? {
              deleteMany: {}, // Remove existing tags
              create: tagIds.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<News> {
    // Check if news exists
    await this.findOne(id);

    // Delete news
    return this.prisma.news.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }
}
