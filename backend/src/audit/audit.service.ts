import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  record(actionType: string, entityType: string, entityId: string, actorUserId: string, actorOrganizationId: string, metadata: any) {
    return this.prisma.auditLog.create({
      data: { actionType, entityType, entityId, actorUserId, actorOrganizationId, metadata },
    });
  }

  findByProject(projectId: string) {
    return this.prisma.auditLog.findMany({ where: { projectId } });
  }
}
