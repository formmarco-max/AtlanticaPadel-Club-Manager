import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClubsService } from './clubs.service';

@ApiTags('Clubs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clubs')
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
  ) {}

  @Get()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Obter todos os clubes',
    description:
      'Devolve a lista de clubes existentes no sistema.',
  })
  @ApiOkResponse({
    description:
      'Lista de clubes devolvida com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para aceder a este recurso.',
  })
  findAll() {
    return this.clubsService.findAll();
  }
}