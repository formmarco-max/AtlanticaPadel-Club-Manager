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

  /**
   * Devolve todos os treinadores registados.
   */
  async findAll() {
    return this.prisma.coach.findMany({
      include: {
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
      },
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
   * Devolve um treinador através do seu identificador.
   */
  async findOne(id: string) {
    const coach = await this.prisma.coach.findUnique({
      where: {
        id,
      },
      include: {
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
      },
    });

    if (!coach) {
      throw new NotFoundException(
        `Não foi encontrado nenhum treinador com o ID "${id}".`,
      );
    }

    return coach;
  }

  /**
   * Cria um novo treinador.
   */
  async create(createCoachDto: CreateCoachDto) {
    const {
      clubId,
      userId,
      employeeNumber,
      firstName,
      lastName,
      email,
      phone,
      specialization,
      biography,
      hireDate,
      isActive,
    } = createCoachDto;

    await this.ensureClubExists(clubId);

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
        firstName,
        lastName,
        email,
        phone,
        specialization,
        biography,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        isActive,
      },
      include: {
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
      },
    });
  }

  /**
   * Atualiza os dados de um treinador.
   */
  async update(id: string, updateCoachDto: UpdateCoachDto) {
    const currentCoach = await this.findOne(id);

    const {
      clubId,
      userId,
      employeeNumber,
      firstName,
      lastName,
      email,
      phone,
      specialization,
      biography,
      hireDate,
      isActive,
    } = updateCoachDto;

    const targetClubId = clubId ?? currentCoach.clubId;

    if (clubId) {
      await this.ensureClubExists(clubId);
    }

    if (
      employeeNumber &&
      employeeNumber !== currentCoach.employeeNumber
    ) {
      await this.ensureEmployeeNumberIsAvailable(employeeNumber, id);
    }

    if (userId && userId !== currentCoach.userId) {
      await this.ensureUserCanBeAssociated(userId, targetClubId, id);
    }

    return this.prisma.coach.update({
      where: {
        id,
      },
      data: {
        clubId,
        userId,
        employeeNumber,
        firstName,
        lastName,
        email,
        phone,
        specialization,
        biography,
        hireDate:
          hireDate !== undefined ? new Date(hireDate) : undefined,
        isActive,
      },
      include: {
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
      },
    });
  }

  /**
   * Remove permanentemente um treinador.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.coach.delete({
      where: {
        id,
      },
      include: {
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
      },
    });
  }

  /**
   * Confirma que o clube existe.
   */
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
      throw new BadRequestException(
        `Não foi encontrado nenhum clube com o ID "${clubId}".`,
      );
    }
  }

  /**
   * Confirma que o número interno do treinador ainda não está a ser utilizado.
   */
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
        `Já existe um treinador com o número "${employeeNumber}".`,
      );
    }
  }

  /**
   * Confirma que o utilizador existe, pertence ao mesmo clube e ainda não
   * está associado a outro treinador.
   */
  private async ensureUserCanBeAssociated(
    userId: string,
    clubId: string,
    excludedCoachId?: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        clubId: true,
      },
    });

    if (!user) {
      throw new BadRequestException(
        `Não foi encontrado nenhum utilizador com o ID "${userId}".`,
      );
    }

    if (user.clubId !== clubId) {
      throw new BadRequestException(
        'O utilizador e o treinador têm de pertencer ao mesmo clube.',
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
}