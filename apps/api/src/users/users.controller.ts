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
  Query,
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

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um utilizador',
    description:
      'Cria um novo utilizador e guarda a palavra-passe sob a forma de hash.',
  })
  @ApiCreatedResponse({
    description: 'Utilizador criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para criar utilizadores.',
  })
  @ApiNotFoundResponse({
    description:
      'O perfil de utilizador indicado não existe.',
  })
  @ApiConflictResponse({
    description:
      'Já existe um utilizador com o email indicado.',
  })
  create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obter utilizadores',
    description:
      'Devolve uma lista paginada de utilizadores, com pesquisa, filtros e ordenação, sem expor os hashes das palavras-passe.',
  })
  @ApiOkResponse({
    description:
      'Lista paginada de utilizadores devolvida com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'Os parâmetros de consulta são inválidos.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para consultar utilizadores.',
  })
  findAll(
    @Query() queryDto: UsersQueryDto,
  ) {
    return this.usersService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um utilizador por ID',
    description:
      'Devolve um utilizador através do respetivo UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do utilizador.',
    example: 'b521fa36-8fd0-4329-8f1b-d4c130ff32f5',
  })
  @ApiOkResponse({
    description: 'Utilizador devolvido com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'O identificador fornecido não é um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para consultar este utilizador.',
  })
  @ApiNotFoundResponse({
    description:
      'O utilizador solicitado não foi encontrado.',
  })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um utilizador',
    description:
      'Atualiza parcialmente os dados de um utilizador.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do utilizador.',
    example: 'b521fa36-8fd0-4329-8f1b-d4c130ff32f5',
  })
  @ApiOkResponse({
    description:
      'Utilizador atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'O identificador ou os dados enviados são inválidos.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para atualizar utilizadores.',
  })
  @ApiNotFoundResponse({
    description:
      'O utilizador ou perfil solicitado não foi encontrado.',
  })
  @ApiConflictResponse({
    description:
      'Já existe outro utilizador com o email indicado.',
  })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar um utilizador',
    description:
      'Elimina permanentemente um utilizador através do respetivo UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do utilizador.',
    example: 'b521fa36-8fd0-4329-8f1b-d4c130ff32f5',
  })
  @ApiNoContentResponse({
    description:
      'Utilizador eliminado com sucesso.',
  })
  @ApiBadRequestResponse({
    description:
      'O identificador fornecido não é um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Token JWT ausente, inválido ou expirado.',
  })
  @ApiForbiddenResponse({
    description:
      'O utilizador autenticado não possui permissão para eliminar utilizadores.',
  })
  @ApiNotFoundResponse({
    description:
      'O utilizador solicitado não foi encontrado.',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<void> {
    await this.usersService.remove(id);
  }
}