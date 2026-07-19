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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@ApiTags('Sócios')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Criar um novo sócio',
    description:
      'Cria uma nova ficha de sócio e, opcionalmente, associa-a a um utilizador existente.',
  })
  @ApiCreatedResponse({
    description: 'Sócio criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Os dados enviados são inválidos, o clube não existe ou o utilizador não pertence ao mesmo clube.',
  })
  @ApiConflictResponse({
    description:
      'O número de sócio já está em utilização ou o utilizador já está associado a outro sócio.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Listar todos os sócios',
    description:
      'Devolve todos os sócios registados, ordenados por primeiro nome e apelido.',
  })
  @ApiOkResponse({
    description: 'Lista de sócios obtida com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Consultar um sócio',
    description: 'Devolve os dados de um sócio através do respetivo UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID do sócio.',
    example: '7b84a4d5-8c41-4c89-a774-52a2f55a79b2',
  })
  @ApiOkResponse({
    description: 'Sócio encontrado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Sócio não encontrado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Atualizar um sócio',
    description:
      'Atualiza parcialmente os dados de um sócio existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID do sócio.',
    example: '7b84a4d5-8c41-4c89-a774-52a2f55a79b2',
  })
  @ApiOkResponse({
    description: 'Sócio atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Os dados enviados são inválidos, o clube não existe ou o utilizador não pertence ao mesmo clube.',
  })
  @ApiNotFoundResponse({
    description: 'Sócio não encontrado.',
  })
  @ApiConflictResponse({
    description:
      'O número de sócio já está em utilização ou o utilizador já está associado a outro sócio.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Eliminar um sócio',
    description:
      'Remove permanentemente a ficha de um sócio da base de dados.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID do sócio.',
    example: '7b84a4d5-8c41-4c89-a774-52a2f55a79b2',
  })
  @ApiNoContentResponse({
    description: 'Sócio eliminado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Sócio não encontrado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}