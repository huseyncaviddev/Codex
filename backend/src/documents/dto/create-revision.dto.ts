import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRevisionDto {
  @IsString()
  @IsNotEmpty()
  revisionCode: string;

  @IsUUID()
  fileId: string;

  @IsDateString()
  issueDate: string;

  @IsUUID()
  issuerOrganizationId: string;

  @IsUUID()
  issuedByUserId: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
