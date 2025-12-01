import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('presign-upload')
  getUploadUrl(@Query('key') key: string, @Query('mimeType') mimeType: string) {
    return this.filesService.getUploadUrl(key, mimeType);
  }

  @Get('presign-download')
  getDownloadUrl(@Query('key') key: string) {
    return this.filesService.getDownloadUrl(key);
  }
}
