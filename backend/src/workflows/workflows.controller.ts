import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get(':projectId')
  list(@Param('projectId') projectId: string) {
    return this.workflowsService.list(projectId);
  }

  @Patch(':id/steps/:stepIndex')
  completeStep(@Param('id') id: string, @Param('stepIndex') stepIndex: number, @Body('decision') decision: string, @Req() req) {
    return this.workflowsService.completeStep(id, Number(stepIndex), decision, req.user.userId);
  }
}
