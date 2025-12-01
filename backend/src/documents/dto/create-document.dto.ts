import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DocumentStatus } from '../../common/enums/document-status.enum';

export class CreateDocumentDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  discipline: string;

  @IsString()
  type: string;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus = DocumentStatus.DRAFT;

  @IsUUID()
  owningOrganizationId: string;
}
