import { Controller, Post, Delete, UploadedFile, UseInterceptors, Param, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload/:path')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('path') path: string,
  ): Promise<{ url: string }> {
    const url = await this.storageService.uploadFile(file, path);
    return { url };
  }

  @Delete('delete')
  async deleteFile(@Body('url') fileUrl: string): Promise<{ message: string }> {
    await this.storageService.deleteFile(fileUrl);
    return { message: 'File deleted successfully' };
  }
} 