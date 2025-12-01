import { WorkflowsService } from './workflows.service';
import { PrismaService } from '../common/prisma/prisma.service';

const prismaMock = {
  workflowStep: {
    update: jest.fn(),
  },
  workflow: {
    update: jest.fn(),
  },
};

describe('WorkflowsService', () => {
  const service = new WorkflowsService(prismaMock as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('advances step index after completion', async () => {
    prismaMock.workflowStep.update.mockResolvedValue({ workflowId: 'wf-1', stepIndex: 0 });
    prismaMock.workflow.update.mockResolvedValue({ id: 'wf-1', currentStepIndex: 1 });

    const step = await service.completeStep('wf-1', 0, 'APPROVED', 'user-1');

    expect(step.stepIndex).toBe(0);
    expect(prismaMock.workflow.update).toHaveBeenCalledWith({ where: { id: 'wf-1' }, data: { currentStepIndex: 1 } });
  });
});
