import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devolve todos os sócios registados.
   */
  async findAll() {
    return this.prisma.member.findMany({
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
   * Devolve um sócio através do seu identificador.
   */
  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
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

    if (!member) {
      throw new NotFoundException(
        `Não foi encontrado nenhum sócio com o ID "${id}".`,
      );
    }

    return member;
  }

  /**
   * Cria um novo sócio.
   */
  async create(createMemberDto: CreateMemberDto) {
    const {
      clubId,
      userId,
      membershipNumber,
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      joinDate,
      notes,
      isActive,
    } = createMemberDto;

    await this.ensureClubExists(clubId);
    await this.ensureMembershipNumberIsAvailable(membershipNumber);

    if (userId) {
      await this.ensureUserCanBeAssociated(userId, clubId);
    }

    return this.prisma.member.create({
      data: {
        clubId,
        userId,
        membershipNumber,
        firstName,
        lastName,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        notes,
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
   * Atualiza os dados de um sócio.
   */
  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const currentMember = await this.findOne(id);

    const {
      clubId,
      userId,
      membershipNumber,
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      joinDate,
      notes,
      isActive,
    } = updateMemberDto;

    const targetClubId = clubId ?? currentMember.clubId;

    if (clubId) {
      await this.ensureClubExists(clubId);
    }

    if (
      membershipNumber &&
      membershipNumber !== currentMember.membershipNumber
    ) {
      await this.ensureMembershipNumberIsAvailable(membershipNumber, id);
    }

    if (userId && userId !== currentMember.userId) {
      await this.ensureUserCanBeAssociated(userId, targetClubId, id);
    }

    return this.prisma.member.update({
      where: {
        id,
      },
      data: {
        clubId,
        userId,
        membershipNumber,
        firstName,
        lastName,
        email,
        phone,
        birthDate:
          birthDate !== undefined ? new Date(birthDate) : undefined,
        joinDate: joinDate !== undefined ? new Date(joinDate) : undefined,
        notes,
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
   * Remove permanentemente um sócio.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.member.delete({
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
   * Confirma que o número de sócio ainda não está a ser utilizado.
   */
  private async ensureMembershipNumberIsAvailable(
    membershipNumber: string,
    excludedMemberId?: string,
  ): Promise<void> {
    const existingMember = await this.prisma.member.findUnique({
      where: {
        membershipNumber,
      },
      select: {
        id: true,
      },
    });

    if (existingMember && existingMember.id !== excludedMemberId) {
      throw new ConflictException(
        `Já existe um sócio com o número "${membershipNumber}".`,
      );
    }
  }

  /**
   * Confirma que o utilizador existe, pertence ao mesmo clube e ainda não
   * está associado a outro sócio.
   */
  private async ensureUserCanBeAssociated(
    userId: string,
    clubId: string,
    excludedMemberId?: string,
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
        'O utilizador e o sócio têm de pertencer ao mesmo clube.',
      );
    }

    const associatedMember = await this.prisma.member.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (associatedMember && associatedMember.id !== excludedMemberId) {
      throw new ConflictException(
        'O utilizador indicado já está associado a outro sócio.',
      );
    }
  }
}