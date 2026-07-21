import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Obter o resumo do dashboard',
  })
  @ApiOkResponse({
    description: 'Resumo do dashboard devolvido com sucesso.',
  })
  getSummary() {
    return this.dashboardService.getSummary();
  }
}