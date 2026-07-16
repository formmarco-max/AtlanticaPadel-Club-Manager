import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter todos os perfis de utilizador',
    description:
      'Devolve a lista de perfis existentes no sistema.',
  })
  @ApiOkResponse({
    description: 'Lista de perfis devolvida com sucesso.',
  })
  findAll() {
    return this.rolesService.findAll();
  }
}