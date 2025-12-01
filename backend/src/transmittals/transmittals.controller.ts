import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransmittalsService } from './transmittals.service';

@Controller('transmittals')
@UseGuards(JwtAuthGuard)
export class TransmittalsController {
  constructor(private readonly transmittalsService: TransmittalsService) {}

  @Get()
  list(@Query('projectId') projectId: string, @Req() req) {
    return this.transmittalsService.list(projectId, req.user.organizationId);
  }
}
