import { Injectable } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  async getUploadUrl(key: string): Promise<string> {
    return `/local-storage/upload/${encodeURIComponent(key)}`;
  }

  async getDownloadUrl(key: string): Promise<string> {
    return `/local-storage/download/${encodeURIComponent(key)}`;
  }
}
