import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { LocalFileStorageService } from './local-file-storage.service';
import { S3FileStorageService } from './s3-file-storage.service';

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    { provide: 'FileStorageService', useClass: process.env.USE_S3 ? S3FileStorageService : LocalFileStorageService },
    { provide: LocalFileStorageService, useExisting: 'FileStorageService' },
    { provide: S3FileStorageService, useExisting: 'FileStorageService' },
  ],
  exports: [FilesService, 'FileStorageService'],
})
export class FilesModule {}
