import { Injectable } from '@nestjs/common';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private bucket;

  constructor(private configService: ConfigService) {
    const serviceAccount = JSON.parse(this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT'));
    
    // Format the private key if it exists
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    
    // Initialize Firebase Admin
    const firebaseConfig = {
      credential: cert(serviceAccount),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET') || `${serviceAccount.project_id}.appspot.com`,
    };

    initializeApp(firebaseConfig);
    this.bucket = getStorage().bucket();
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    try {
      const fileName = `${path}/${Date.now()}-${file.originalname}`;
      const fileUpload = this.bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          reject(error);
        });

        stream.on('finish', async () => {
          // Make the file public
          await fileUpload.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
          resolve(publicUrl);
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = fileUrl.split(`${this.bucket.name}/`)[1];
      await this.bucket.file(fileName).delete();
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
} 