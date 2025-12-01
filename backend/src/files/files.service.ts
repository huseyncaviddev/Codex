import { Inject, Injectable } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Injectable()
export class FilesService {
  constructor(@Inject('FileStorageService') private storageService: FileStorageService) {}

  getUploadUrl(key: string, mimeType: string) {
    return this.storageService.getUploadUrl(key, mimeType);
  }

  getDownloadUrl(key: string) {
    return this.storageService.getDownloadUrl(key);
  }
}
