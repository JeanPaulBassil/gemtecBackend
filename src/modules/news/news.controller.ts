import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("news")
@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a news article" })
  @ApiResponse({
    status: 201,
    description: "The news article has been successfully created.",
  })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({
    summary: "Find all news articles with pagination and filters",
  })
  @ApiResponse({
    status: 200,
    description: "Return all news articles that match the filters.",
  })
  findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("categoryId") categoryId?: string,
    @Query("tagId") tagId?: string,
    @Query("isPublished") isPublished?: string,
  ) {
    return this.newsService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      categoryId,
      tagId,
      isPublished:
        isPublished === undefined ? undefined : isPublished === "true",
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Find a news article by ID" })
  @ApiResponse({ status: 200, description: "Return the news article." })
  @ApiResponse({ status: 404, description: "News article not found." })
  findOne(@Param("id") id: string) {
    return this.newsService.findOne(id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Find a news article by slug" })
  @ApiResponse({ status: 200, description: "Return the news article." })
  @ApiResponse({ status: 404, description: "News article not found." })
  findBySlug(@Param("slug") slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a news article" })
  @ApiResponse({
    status: 200,
    description: "The news article has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "News article not found." })
  update(@Param("id") id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a news article" })
  @ApiResponse({
    status: 200,
    description: "The news article has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "News article not found." })
  remove(@Param("id") id: string) {
    return this.newsService.remove(id);
  }
}
