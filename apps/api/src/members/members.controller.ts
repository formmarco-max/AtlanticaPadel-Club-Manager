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

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
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
      'Cria uma nova ficha de sócio no clube do utilizador autenticado e, opcionalmente, associa-a a um utilizador existente do mesmo clube.',
  })
  @ApiCreatedResponse({
    description: 'Sócio criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Os dados enviados são inválidos ou o utilizador associado não pertence ao mesmo clube.',
  })
  @ApiConflictResponse({
    description:
      'O número de sócio já está em utilização ou o utilizador já está associado a outro sócio.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.membersService.create(
      currentUser.clubId,
      createMemberDto,
    );
  }

  @Get()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Listar os sócios do clube',
    description:
      'Devolve os sócios do clube do utilizador autenticado, ordenados por primeiro nome e apelido.',
  })
  @ApiOkResponse({
    description: 'Lista de sócios obtida com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.membersService.findAll(currentUser.clubId);
  }

  @Get(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Consultar um sócio',
    description:
      'Devolve um sócio do clube do utilizador autenticado através do respetivo UUID.',
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
    description:
      'Sócio não encontrado no clube do utilizador autenticado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.membersService.findOne(
      id,
      currentUser.clubId,
    );
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Atualizar um sócio',
    description:
      'Atualiza parcialmente os dados de um sócio pertencente ao clube do utilizador autenticado.',
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
      'Os dados enviados são inválidos ou o utilizador associado não pertence ao mesmo clube.',
  })
  @ApiNotFoundResponse({
    description:
      'Sócio não encontrado no clube do utilizador autenticado.',
  })
  @ApiConflictResponse({
    description:
      'O número de sócio já está em utilização ou o utilizador já está associado a outro sócio.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(
      id,
      currentUser.clubId,
      updateMemberDto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({
    summary: 'Eliminar um sócio',
    description:
      'Remove permanentemente um sócio pertencente ao clube do utilizador autenticado.',
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
    description:
      'Sócio não encontrado no clube do utilizador autenticado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Autenticação necessária.',
  })
  remove(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.membersService.remove(
      id,
      currentUser.clubId,
    );
  }
}