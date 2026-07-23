import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@ApiTags('Campos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('courts')
export class CourtsController {
  constructor(
    private readonly courtsService: CourtsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo campo',
    description:
      'Cria um novo campo associado ao clube do utilizador autenticado.',
  })
  @ApiCreatedResponse({
    description: 'Campo criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiConflictResponse({
    description:
      'Já existe um campo com este nome no clube.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador não possui permissão para criar campos.',
  })
  create(
    @CurrentUser('clubId') clubId: string,
    @Body() createCourtDto: CreateCourtDto,
  ) {
    return this.courtsService.create(
      clubId,
      createCourtDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar os campos do clube',
    description:
      'Devolve os campos pertencentes ao clube do utilizador autenticado.',
  })
  @ApiOkResponse({
    description: 'Lista de campos devolvida com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador não possui permissão para consultar campos.',
  })
  findAll(
    @CurrentUser('clubId') clubId: string,
  ) {
    return this.courtsService.findAll(clubId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar um campo',
    description:
      'Devolve um campo pertencente ao clube do utilizador autenticado.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do campo.',
    example: '14141ecf-b096-4381-80f9-dbecb89a6d0a',
  })
  @ApiOkResponse({
    description: 'Campo encontrado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'O UUID do campo é inválido.',
  })
  @ApiNotFoundResponse({
    description:
      'O campo não existe ou não pertence ao clube autenticado.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador não possui permissão para consultar campos.',
  })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @CurrentUser('clubId') clubId: string,
  ) {
    return this.courtsService.findOne(id, clubId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um campo',
    description:
      'Atualiza os dados de um campo pertencente ao clube do utilizador autenticado.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do campo.',
    example: '14141ecf-b096-4381-80f9-dbecb89a6d0a',
  })
  @ApiOkResponse({
    description: 'Campo atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'O UUID ou os dados enviados são inválidos.',
  })
  @ApiNotFoundResponse({
    description:
      'O campo não existe ou não pertence ao clube autenticado.',
  })
  @ApiConflictResponse({
    description:
      'Já existe um campo com este nome no clube.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador não possui permissão para atualizar campos.',
  })
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @CurrentUser('clubId') clubId: string,
    @Body() updateCourtDto: UpdateCourtDto,
  ) {
    return this.courtsService.update(
      id,
      clubId,
      updateCourtDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar um campo',
    description:
      'Elimina permanentemente um campo pertencente ao clube do utilizador autenticado.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do campo.',
    example: '14141ecf-b096-4381-80f9-dbecb89a6d0a',
  })
  @ApiNoContentResponse({
    description: 'Campo eliminado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'O UUID do campo é inválido.',
  })
  @ApiNotFoundResponse({
    description:
      'O campo não existe ou não pertence ao clube autenticado.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador não possui permissão para eliminar campos.',
  })
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @CurrentUser('clubId') clubId: string,
  ): Promise<void> {
    await this.courtsService.remove(id, clubId);
  }
}