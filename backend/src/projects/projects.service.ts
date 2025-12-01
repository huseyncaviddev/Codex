import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { participants: { some: { userId } } },
      include: { organizations: true },
    });
  }
}
