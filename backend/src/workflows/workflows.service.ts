import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  list(projectId: string) {
    return this.prisma.workflow.findMany({
      where: { projectId },
      include: { steps: true },
    });
  }

  async completeStep(workflowId: string, stepIndex: number, decision: string, decidedByUserId: string) {
    const step = await this.prisma.workflowStep.update({
      where: { workflowId_stepIndex: { workflowId, stepIndex } },
      data: { status: 'DONE', decision, decidedByUserId, decidedAt: new Date() },
    });
    await this.prisma.workflow.update({ where: { id: workflowId }, data: { currentStepIndex: stepIndex + 1 } });
    return step;
  }
}
