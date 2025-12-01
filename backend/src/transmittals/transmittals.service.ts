import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TransmittalsService {
  constructor(private prisma: PrismaService) {}

  list(projectId: string, organizationId: string) {
    return this.prisma.transmittal.findMany({
      where: {
        projectId,
        OR: [
          { toOrganizations: { some: { organizationId } } },
          { fromOrganizationId: organizationId },
        ],
      },
      include: { linkedRevisions: true, messages: true },
    });
  }
}
