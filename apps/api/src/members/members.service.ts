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
   * Devolve todos os sócios pertencentes ao clube indicado.
   */
  async findAll(clubId: string) {
    return this.prisma.member.findMany({
      where: {
        clubId,
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
            firstName: true,
            lastName: true,
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
   * Devolve um sócio pertencente ao clube indicado.
   */
  async findOne(id: string, clubId: string) {
    const member = await this.prisma.member.findFirst({
      where: {
        id,
        clubId,
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
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException(
        `Não foi encontrado nenhum sócio com o ID "${id}" neste clube.`,
      );
    }

    return member;
  }

  /**
   * Cria um novo sócio no clube indicado.
   */
  async create(
    clubId: string,
    createMemberDto: CreateMemberDto,
  ) {
    const {
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

    await this.ensureMembershipNumberIsAvailable(
      membershipNumber,
    );

    if (userId) {
      await this.ensureUserCanBeAssociated(
        userId,
        clubId,
      );
    }

    return this.prisma.member.create({
      data: {
        clubId,
        userId,
        membershipNumber: membershipNumber.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email?.trim().toLowerCase(),
        phone: phone?.trim(),
        birthDate: birthDate
          ? new Date(birthDate)
          : undefined,
        joinDate: joinDate
          ? new Date(joinDate)
          : undefined,
        notes: notes?.trim(),
        isActive: isActive ?? true,
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
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Atualiza um sócio pertencente ao clube indicado.
   */
  async update(
    id: string,
    clubId: string,
    updateMemberDto: UpdateMemberDto,
  ) {
    const currentMember = await this.findOne(id, clubId);

    const {
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

    if (
      membershipNumber &&
      membershipNumber !== currentMember.membershipNumber
    ) {
      await this.ensureMembershipNumberIsAvailable(
        membershipNumber,
        id,
      );
    }

    if (
      userId &&
      userId !== currentMember.userId
    ) {
      await this.ensureUserCanBeAssociated(
        userId,
        clubId,
        id,
      );
    }

    return this.prisma.member.update({
      where: {
        id,
      },
      data: {
        userId,
        membershipNumber:
          membershipNumber !== undefined
            ? membershipNumber.trim()
            : undefined,
        firstName:
          firstName !== undefined
            ? firstName.trim()
            : undefined,
        lastName:
          lastName !== undefined
            ? lastName.trim()
            : undefined,
        email:
          email !== undefined
            ? email.trim().toLowerCase()
            : undefined,
        phone:
          phone !== undefined
            ? phone.trim()
            : undefined,
        birthDate:
          birthDate !== undefined
            ? new Date(birthDate)
            : undefined,
        joinDate:
          joinDate !== undefined
            ? new Date(joinDate)
            : undefined,
        notes:
          notes !== undefined
            ? notes.trim()
            : undefined,
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
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Remove permanentemente um sócio pertencente ao clube indicado.
   */
  async remove(id: string, clubId: string) {
    await this.findOne(id, clubId);

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
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Confirma que o número de sócio ainda não está a ser utilizado.
   */
  private async ensureMembershipNumberIsAvailable(
    membershipNumber: string,
    excludedMemberId?: string,
  ): Promise<void> {
    const normalizedMembershipNumber =
      membershipNumber.trim();

    const existingMember =
      await this.prisma.member.findUnique({
        where: {
          membershipNumber: normalizedMembershipNumber,
        },
        select: {
          id: true,
        },
      });

    if (
      existingMember &&
      existingMember.id !== excludedMemberId
    ) {
      throw new ConflictException(
        `Já existe um sócio com o número "${normalizedMembershipNumber}".`,
      );
    }
  }

  /**
   * Confirma que o utilizador existe, pertence ao mesmo clube
   * e ainda não está associado a outro sócio.
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

    const associatedMember =
      await this.prisma.member.findUnique({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });

    if (
      associatedMember &&
      associatedMember.id !== excludedMemberId
    ) {
      throw new ConflictException(
        'O utilizador indicado já está associado a outro sócio.',
      );
    }
  }
}