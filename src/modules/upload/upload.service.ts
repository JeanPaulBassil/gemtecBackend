import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  async uploadFile(file: { buffer: number[]; originalname: string }): Promise<{ fileUrl: string }> {
    try {
      // Validate input
      if (!file || !Array.isArray(file.buffer) || !file.originalname) {
        throw new HttpException('Invalid file data', HttpStatus.BAD_REQUEST);
      }

      // Ensure upload directory exists
      if (!existsSync(this.uploadDir)) {
        try {
          await mkdir(this.uploadDir, { recursive: true });
        } catch (error) {
          console.error('Error creating upload directory:', error);
          throw new HttpException('Failed to create upload directory', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      // Create a unique filename using timestamp
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop();
      if (!fileExtension) {
        throw new HttpException('Invalid file extension', HttpStatus.BAD_REQUEST);
      }

      const fileName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
      const filePath = join(this.uploadDir, fileName);

      // Convert buffer array back to Buffer
      let buffer: Buffer;
      try {
        buffer = Buffer.from(file.buffer);
      } catch (error) {
        console.error('Error converting buffer:', error);
        throw new HttpException('Invalid file buffer', HttpStatus.BAD_REQUEST);
      }

      // Write the file
      try {
        await writeFile(filePath, buffer);
      } catch (error) {
        console.error('Error writing file:', error);
        throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Return the file URL
      return {
        fileUrl: `/uploads/${fileName}`,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while uploading the file',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const fileName = fileUrl.split('/').pop();
      if (!fileName) {
        throw new HttpException('Invalid file URL', HttpStatus.BAD_REQUEST);
      }

      const filePath = join(this.uploadDir, fileName);

      // Check if file exists
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
          throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while deleting the file',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 