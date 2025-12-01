import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { DocumentStatus } from '../common/enums/document-status.enum';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async createDocument(dto: CreateDocumentDto, createdByUserId: string) {
    return this.prisma.document.create({
      data: { ...dto, createdByUserId },
    });
  }

  async addRevision(documentId: string, dto: CreateRevisionDto) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) throw new Error('Document not found');

    const existing = await this.prisma.documentRevision.updateMany({
      where: { documentId, isCurrent: true },
      data: { isCurrent: false, supersededFlag: true },
    });

    await this.prisma.document.update({ where: { id: documentId }, data: { status: DocumentStatus.ISSUED_FOR_REVIEW } });

    return this.prisma.documentRevision.create({
      data: {
        documentId,
        ...dto,
        isCurrent: true,
      },
    });
  }
}
