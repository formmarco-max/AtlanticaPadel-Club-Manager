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
import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Obter todos os perfis de utilizador',
    description:
      'Devolve a lista de perfis existentes no sistema.',
  })
  @ApiOkResponse({
    description:
      'Lista de perfis devolvida com sucesso.',
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
    return this.rolesService.findAll();
  }
}