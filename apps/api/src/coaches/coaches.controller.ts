import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@ApiTags('Coaches')
@ApiBearerAuth()
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os treinadores',
  })
  @ApiOkResponse({
    description: 'Lista de treinadores devolvida com sucesso.',
  })
  findAll() {
    return this.coachesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um treinador pelo ID',
  })
  @ApiOkResponse({
    description: 'Treinador encontrado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Treinador não encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar um treinador',
  })
  @ApiCreatedResponse({
    description: 'Treinador criado com sucesso.',
  })
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um treinador',
  })
  @ApiOkResponse({
    description: 'Treinador atualizado com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Treinador não encontrado.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um treinador',
  })
  @ApiOkResponse({
    description: 'Treinador removido com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Treinador não encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.coachesService.remove(id);
  }
}