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
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@ApiTags('Treinadores')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo treinador',
    description:
      'Cria um treinador associado ao clube do utilizador autenticado.',
  })
  @ApiBody({ type: CreateCoachDto })
  @ApiResponse({
    status: 201,
    description: 'Treinador criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Os dados fornecidos não são válidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilizador não autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Utilizador sem permissão para executar esta operação.',
  })
  @ApiResponse({
    status: 409,
    description:
      'O número interno ou o utilizador associado já se encontram em utilização.',
  })
  create(
    @CurrentUser('clubId') clubId: string,
    @Body() createCoachDto: CreateCoachDto,
  ) {
    return this.coachesService.create(clubId, createCoachDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar os treinadores do clube autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de treinadores obtida com sucesso.',
  })
  findAll(@CurrentUser('clubId') clubId: string) {
    return this.coachesService.findAll(clubId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um treinador',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Identificador UUID do treinador.',
  })
  @ApiResponse({
    status: 200,
    description: 'Treinador encontrado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O identificador fornecido não é um UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Treinador não encontrado.',
  })
  findOne(
    @CurrentUser('clubId') clubId: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return this.coachesService.findOne(id, clubId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um treinador',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Identificador UUID do treinador.',
  })
  @ApiBody({ type: UpdateCoachDto })
  @ApiResponse({
    status: 200,
    description: 'Treinador atualizado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O identificador ou os dados fornecidos não são válidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Treinador não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'O número interno ou o utilizador associado já se encontram em utilização.',
  })
  update(
    @CurrentUser('clubId') clubId: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ) {
    return this.coachesService.update(id, clubId, updateCoachDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar um treinador',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Identificador UUID do treinador.',
  })
  @ApiResponse({
    status: 204,
    description: 'Treinador eliminado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O identificador fornecido não é um UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Treinador não encontrado.',
  })
  async remove(
    @CurrentUser('clubId') clubId: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ): Promise<void> {
    await this.coachesService.remove(id, clubId);
  }
}
