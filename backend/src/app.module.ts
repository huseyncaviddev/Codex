import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { TransmittalsModule } from './transmittals/transmittals.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { AuditModule } from './audit/audit.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    DocumentsModule,
    TransmittalsModule,
    WorkflowsModule,
    AuditModule,
    FilesModule,
  ],
})
export class AppModule {}
