import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@ApiTags('Clubes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Obter todos os clubes',
    description: 'Devolve a lista de clubes existentes no sistema.',
  })
  @ApiOkResponse({
    description: 'Lista de clubes devolvida com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para aceder a este recurso.',
  })
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Obter um clube',
    description: 'Devolve os dados de um clube através do respetivo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do clube',
    example: '2cbdfc17-3f3b-48d7-8e83-6d6ac0308d32',
  })
  @ApiOkResponse({
    description: 'Clube devolvido com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'O ID fornecido não é um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para aceder a este recurso.',
  })
  @ApiNotFoundResponse({
    description: 'Clube não encontrado.',
  })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ) {
    return this.clubsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Criar um clube',
    description: 'Cria um novo clube no sistema.',
  })
  @ApiCreatedResponse({
    description: 'Clube criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Os dados fornecidos são inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para aceder a este recurso.',
  })
  @ApiConflictResponse({
    description: 'Já existe um clube com o mesmo nome ou identificador.',
  })
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Atualizar um clube',
    description:
      'Atualiza total ou parcialmente os dados de um clube existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do clube',
    example: '2cbdfc17-3f3b-48d7-8e83-6d6ac0308d32',
  })
  @ApiOkResponse({
    description: 'Clube atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'O ID ou os dados fornecidos são inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para aceder a este recurso.',
  })
  @ApiNotFoundResponse({
    description: 'Clube não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Já existe um clube com o mesmo nome ou identificador.',
  })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
    @Body() updateClubDto: UpdateClubDto,
  ) {
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Eliminar um clube',
    description: 'Elimina permanentemente um clube do sistema.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do clube',
    example: '2cbdfc17-3f3b-48d7-8e83-6d6ac0308d32',
  })
  @ApiOkResponse({
    description: 'Clube eliminado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'O ID fornecido não é um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para aceder a este recurso.',
  })
  @ApiNotFoundResponse({
    description: 'Clube não encontrado.',
  })
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ) {
    return this.clubsService.remove(id);
  }
}