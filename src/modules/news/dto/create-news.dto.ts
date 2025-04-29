import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateNewsDto {
  @ApiProperty({ description: "News article title" })
  @IsString()
  title: string;

  @ApiProperty({ description: "URL-friendly slug" })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: "Short summary or excerpt" })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: "Main content (Markdown or HTML)" })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: "URL to featured image" })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: "Whether the article is published" })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: "Publish date and time" })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @ApiPropertyOptional({ description: "Category ID" })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: "Author name" })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ description: "Array of tag IDs" })
  @IsUUID("4", { each: true })
  @IsOptional()
  tagIds?: string[];
}
