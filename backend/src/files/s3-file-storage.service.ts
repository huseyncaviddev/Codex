import { Injectable } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Injectable()
export class S3FileStorageService implements FileStorageService {
  async getUploadUrl(key: string, _contentType: string, _expiresInSeconds = 900): Promise<string> {
    return `https://s3.example.com/presign/upload/${encodeURIComponent(key)}`;
  }

  async getDownloadUrl(key: string, _expiresInSeconds = 900): Promise<string> {
    return `https://s3.example.com/presign/download/${encodeURIComponent(key)}`;
  }
}
