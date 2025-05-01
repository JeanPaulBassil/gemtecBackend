import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('resume')
  async uploadResume(@Body() body: { file: { buffer: number[]; originalname: string } }) {
    try {
      // Validate request body
      if (!body || !body.file) {
        throw new HttpException('Missing file data', HttpStatus.BAD_REQUEST);
      }

      // Validate file buffer
      if (!Array.isArray(body.file.buffer)) {
        throw new HttpException('Invalid file buffer format', HttpStatus.BAD_REQUEST);
      }

      // Validate file name
      if (!body.file.originalname) {
        throw new HttpException('Missing file name', HttpStatus.BAD_REQUEST);
      }

      // Validate file extension
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = body.file.originalname.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new HttpException(
          'Invalid file type. Only PDF and Word documents are allowed.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate file size (5MB limit)
      const fileSizeInBytes = body.file.buffer.length;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (fileSizeInBytes > maxSizeInBytes) {
        throw new HttpException(
          'File size exceeds the 5MB limit',
          HttpStatus.BAD_REQUEST
        );
      }

      return this.uploadService.uploadFile(body.file);
    } catch (error) {
      console.error('Error in uploadResume:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while processing the file upload',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 