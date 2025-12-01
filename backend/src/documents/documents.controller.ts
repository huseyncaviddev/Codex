import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(Role.ORG_ADMIN, Role.DCC)
  create(@Body() dto: CreateDocumentDto, @Req() req) {
    return this.documentsService.createDocument(dto, req.user.userId);
  }

  @Post(':id/revisions')
  @Roles(Role.ORG_ADMIN, Role.DCC)
  addRevision(@Param('id') id: string, @Body() dto: CreateRevisionDto) {
    return this.documentsService.addRevision(id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService['prisma'].document.findUnique({
      where: { id },
      include: { revisions: true },
    });
  }
}
