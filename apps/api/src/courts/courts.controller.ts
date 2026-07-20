import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
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
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@ApiTags('Campos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo campo',
    description: 'Cria um novo campo associado a um clube.',
  })
  @ApiCreatedResponse({
    description: 'Campo criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados enviados inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Clube não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Já existe um campo com este nome no clube indicado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente ou inválido.',
  })
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os campos',
    description: 'Devolve a lista de campos registados.',
  })
  @ApiOkResponse({
    description: 'Lista de campos devolvida com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente ou inválido.',
  })
  findAll() {
    return this.courtsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar um campo',
    description: 'Devolve os dados de um campo através do seu UUID.',
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
    description: 'UUID do campo inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Campo não encontrado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente ou inválido.',
  })
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um campo',
    description: 'Atualiza total ou parcialmente os dados de um campo.',
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
    description: 'UUID ou dados enviados inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Campo ou clube não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Já existe um campo com este nome no clube indicado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente ou inválido.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCourtDto: UpdateCourtDto,
  ) {
    return this.courtsService.update(id, updateCourtDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar um campo',
    description: 'Elimina permanentemente um campo.',
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
    description: 'UUID do campo inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Campo não encontrado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente ou inválido.',
  })
  remove(@Param('id') id: string) {
    return this.courtsService.remove(id);
  }
}