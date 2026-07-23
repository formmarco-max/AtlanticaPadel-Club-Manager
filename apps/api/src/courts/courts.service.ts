import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Relações devolvidas juntamente com os dados do campo.
   */
  private readonly courtInclude = {
    club: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  } satisfies Prisma.CourtInclude;

  /**
   * Devolve todos os campos pertencentes ao clube autenticado.
   */
  async findAll(clubId: string) {
    return this.prisma.court.findMany({
      where: {
        clubId,
      },
      include: this.courtInclude,
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Devolve um campo do clube autenticado através do seu UUID.
   *
   * A utilização simultânea do id e do clubId impede que um
   * utilizador consulte campos pertencentes a outro clube.
   */
  async findOne(id: string, clubId: string) {
    const court = await this.prisma.court.findFirst({
      where: {
        id,
        clubId,
      },
      include: this.courtInclude,
    });

    if (!court) {
      throw new NotFoundException('Campo não encontrado.');
    }

    return court;
  }

  /**
   * Cria um novo campo no clube do utilizador autenticado.
   */
  async create(
    clubId: string,
    createCourtDto: CreateCourtDto,
  ) {
    const normalizedName = createCourtDto.name.trim();

    await this.validateCourtNameIsUnique(
      clubId,
      normalizedName,
    );

    return this.prisma.court.create({
      data: {
        clubId,
        name: normalizedName,
        description: this.normalizeOptionalText(
          createCourtDto.description,
        ),
        location: this.normalizeOptionalText(
          createCourtDto.location,
        ),
        surfaceType: createCourtDto.surfaceType,
        courtType: createCourtDto.courtType,
        environment: createCourtDto.environment,
        hourlyPrice: createCourtDto.hourlyPrice,
        isActive: createCourtDto.isActive,
      },
      include: this.courtInclude,
    });
  }

  /**
   * Atualiza um campo pertencente ao clube autenticado.
   */
  async update(
    id: string,
    clubId: string,
    updateCourtDto: UpdateCourtDto,
  ) {
    const existingCourt = await this.findOne(id, clubId);

    const normalizedName =
      updateCourtDto.name !== undefined
        ? updateCourtDto.name.trim()
        : existingCourt.name;

    if (normalizedName !== existingCourt.name) {
      await this.validateCourtNameIsUnique(
        clubId,
        normalizedName,
        existingCourt.id,
      );
    }

    return this.prisma.court.update({
      where: {
        id: existingCourt.id,
      },
      data: {
        name:
          updateCourtDto.name !== undefined
            ? normalizedName
            : undefined,

        description:
          updateCourtDto.description !== undefined
            ? this.normalizeOptionalText(
                updateCourtDto.description,
              )
            : undefined,

        location:
          updateCourtDto.location !== undefined
            ? this.normalizeOptionalText(
                updateCourtDto.location,
              )
            : undefined,

        surfaceType: updateCourtDto.surfaceType,
        courtType: updateCourtDto.courtType,
        environment: updateCourtDto.environment,
        hourlyPrice: updateCourtDto.hourlyPrice,
        isActive: updateCourtDto.isActive,
      },
      include: this.courtInclude,
    });
  }

  /**
   * Elimina permanentemente um campo pertencente ao clube autenticado.
   */
  async remove(
    id: string,
    clubId: string,
  ): Promise<void> {
    const existingCourt = await this.findOne(id, clubId);

    await this.prisma.court.delete({
      where: {
        id: existingCourt.id,
      },
    });
  }

  /**
   * Confirma que ainda não existe outro campo com o mesmo nome
   * dentro do clube.
   */
  private async validateCourtNameIsUnique(
    clubId: string,
    name: string,
    ignoredCourtId?: string,
  ): Promise<void> {
    const existingCourt = await this.prisma.court.findFirst({
      where: {
        clubId,
        name: {
          equals: name.trim(),
          mode: 'insensitive',
        },
        id: ignoredCourtId
          ? {
              not: ignoredCourtId,
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });

    if (existingCourt) {
      throw new ConflictException(
        'Já existe um campo com este nome no clube.',
      );
    }
  }

  /**
   * Remove espaços do início e fim de um texto opcional.
   *
   * Uma string composta apenas por espaços é guardada como null,
   * em vez de permanecer como uma string vazia.
   */
  private normalizeOptionalText(
    value: string | undefined,
  ): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalizedValue = value.trim();

    return normalizedValue.length > 0
      ? normalizedValue
      : null;
  }
}