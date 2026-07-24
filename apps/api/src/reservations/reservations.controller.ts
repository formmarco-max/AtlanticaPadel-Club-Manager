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
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';

@ApiTags('Reservas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova reserva',
    description:
      'Cria uma reserva para um campo e sócio do clube autenticado, validando disponibilidade, horário de funcionamento e regras do clube.',
  })
  @ApiBody({
    type: CreateReservationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos, campo indisponível, sócio inativo ou reserva fora do horário permitido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Clube, campo ou sócio não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Já existe uma reserva para o campo no período indicado.',
  })
  create(
    @CurrentUser('clubId') clubId: string,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.create(
      clubId,
      createReservationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar as reservas do clube autenticado',
    description:
      'Devolve as reservas pertencentes ao clube autenticado, incluindo os dados resumidos do clube, campo e sócio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas obtida com sucesso.',
  })
  findAll(@CurrentUser('clubId') clubId: string) {
    return this.reservationsService.findAll(clubId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter uma reserva',
    description:
      'Devolve uma reserva do clube autenticado através do respetivo identificador UUID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Identificador UUID da reserva.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O identificador fornecido não é um UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada.',
  })
  findOne(
    @CurrentUser('clubId') clubId: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: 400,
      }),
    )
    id: string,
  ) {
    return this.reservationsService.findOne(id, clubId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar uma reserva',
    description:
      'Atualiza parcialmente uma reserva do clube autenticado e volta a validar as regras de disponibilidade quando necessário.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Identificador UUID da reserva.',
  })
  @ApiBody({
    type: UpdateReservationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva atualizada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'O identificador ou os dados da reserva não são válidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva, clube, campo ou sócio não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Já existe uma reserva para o campo no período indicado.',
  })
  update(
    @CurrentUser('clubId') clubId: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: 400,
      }),
    )
    id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(
      id,
      clubId,
      updateReservationDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar uma reserva',
    description:
      'Elimina definitivamente uma reserva do clube autenticado através do respetivo identificador UUID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Identificador UUID da reserva.',
  })
  @ApiResponse({
    status: 204,
    description: 'Reserva eliminada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O identificador fornecido não é um UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada.',
  })
  async remove(
    @CurrentUser('clubId') clubId: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: 400,
      }),
    )
    id: string,
  ) {
    await this.reservationsService.remove(id, clubId);
  }
}