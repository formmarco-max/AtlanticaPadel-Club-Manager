import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@Injectable()
export class CoachesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly coachInclude = {
    club: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    user: {
      select: {
        id: true,
        email: true,
      },
    },
  } as const;

  /**
   * Devolve exclusivamente os treinadores do clube autenticado.
   */
  async findAll(clubId: string) {
    return this.prisma.coach.findMany({
      where: {
        clubId,
      },
      include: this.coachInclude,
      orderBy: [
        {
          firstName: 'asc',
        },
        {
          lastName: 'asc',
        },
      ],
    });
  }

  /**
   * Devolve um treinador, garantindo que pertence ao clube autenticado.
   */
  async findOne(id: string, clubId: string) {
    const coach = await this.prisma.coach.findFirst({
      where: {
        id,
        clubId,
      },
      include: this.coachInclude,
    });

    if (!coach) {
      throw new NotFoundException('Treinador não encontrado.');
    }

    return coach;
  }

  /**
   * Cria um treinador no clube autenticado.
   * O clubId nunca é recebido através do corpo do pedido.
   */
  async create(clubId: string, createCoachDto: CreateCoachDto) {
    await this.ensureClubExists(clubId);

    const employeeNumber = this.normalizeOptionalText(
      createCoachDto.employeeNumber,
    );
    const userId = createCoachDto.userId;

    if (employeeNumber) {
      await this.ensureEmployeeNumberIsAvailable(employeeNumber);
    }

    if (userId) {
      await this.ensureUserCanBeAssociated(userId, clubId);
    }

    return this.prisma.coach.create({
      data: {
        clubId,
        userId,
        employeeNumber,
        firstName: createCoachDto.firstName.trim(),
        lastName: createCoachDto.lastName.trim(),
        email: this.normalizeOptionalEmail(createCoachDto.email),
        phone: this.normalizeOptionalText(createCoachDto.phone),
        specialization: this.normalizeOptionalText(
          createCoachDto.specialization,
        ),
        biography: this.normalizeOptionalText(createCoachDto.biography),
        hireDate: createCoachDto.hireDate
          ? new Date(createCoachDto.hireDate)
          : undefined,
        isActive: createCoachDto.isActive ?? true,
      },
      include: this.coachInclude,
    });
  }

  /**
   * Atualiza um treinador do clube autenticado.
   * Não permite alterar o clube do registo.
   */
  async update(
    id: string,
    clubId: string,
    updateCoachDto: UpdateCoachDto,
  ) {
    const currentCoach = await this.findOne(id, clubId);

    const employeeNumber =
      updateCoachDto.employeeNumber !== undefined
        ? this.normalizeOptionalText(updateCoachDto.employeeNumber)
        : undefined;

    if (
      employeeNumber &&
      employeeNumber !== currentCoach.employeeNumber
    ) {
      await this.ensureEmployeeNumberIsAvailable(employeeNumber, id);
    }

    if (
      updateCoachDto.userId &&
      updateCoachDto.userId !== currentCoach.userId
    ) {
      await this.ensureUserCanBeAssociated(
        updateCoachDto.userId,
        clubId,
        id,
      );
    }

    return this.prisma.coach.update({
      where: {
        id,
      },
      data: {
        userId: updateCoachDto.userId,
        employeeNumber,
        firstName: updateCoachDto.firstName?.trim(),
        lastName: updateCoachDto.lastName?.trim(),
        email:
          updateCoachDto.email !== undefined
            ? this.normalizeOptionalEmail(updateCoachDto.email)
            : undefined,
        phone:
          updateCoachDto.phone !== undefined
            ? this.normalizeOptionalText(updateCoachDto.phone)
            : undefined,
        specialization:
          updateCoachDto.specialization !== undefined
            ? this.normalizeOptionalText(updateCoachDto.specialization)
            : undefined,
        biography:
          updateCoachDto.biography !== undefined
            ? this.normalizeOptionalText(updateCoachDto.biography)
            : undefined,
        hireDate:
          updateCoachDto.hireDate !== undefined
            ? updateCoachDto.hireDate
              ? new Date(updateCoachDto.hireDate)
              : null
            : undefined,
        isActive: updateCoachDto.isActive,
      },
      include: this.coachInclude,
    });
  }

  /**
   * Elimina um treinador do clube autenticado.
   */
  async remove(id: string, clubId: string): Promise<void> {
    await this.findOne(id, clubId);

    await this.prisma.coach.delete({
      where: {
        id,
      },
    });
  }

  private async ensureClubExists(clubId: string): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        id: true,
      },
    });

    if (!club) {
      throw new BadRequestException('O clube autenticado não existe.');
    }
  }

  private async ensureEmployeeNumberIsAvailable(
    employeeNumber: string,
    excludedCoachId?: string,
  ): Promise<void> {
    const existingCoach = await this.prisma.coach.findUnique({
      where: {
        employeeNumber,
      },
      select: {
        id: true,
      },
    });

    if (existingCoach && existingCoach.id !== excludedCoachId) {
      throw new ConflictException(
        'Já existe um treinador com este número interno.',
      );
    }
  }

  private async ensureUserCanBeAssociated(
    userId: string,
    clubId: string,
    excludedCoachId?: string,
  ): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        clubId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'O utilizador indicado não existe ou não pertence ao clube autenticado.',
      );
    }

    const associatedCoach = await this.prisma.coach.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (associatedCoach && associatedCoach.id !== excludedCoachId) {
      throw new ConflictException(
        'O utilizador indicado já está associado a outro treinador.',
      );
    }
  }

  private normalizeOptionalText(
    value: string | undefined,
  ): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalizedValue = value.trim();
    return normalizedValue.length > 0 ? normalizedValue : null;
  }

  private normalizeOptionalEmail(
    value: string | undefined,
  ): string | null | undefined {
    const normalizedValue = this.normalizeOptionalText(value);
    return typeof normalizedValue === 'string'
      ? normalizedValue.toLowerCase()
      : normalizedValue;
  }
}
