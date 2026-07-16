import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      service: 'APCM API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}