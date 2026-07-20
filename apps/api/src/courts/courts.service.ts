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

  private readonly courtInclude = {
    club: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  } satisfies Prisma.CourtInclude;

  async findAll() {
    return this.prisma.court.findMany({
      include: this.courtInclude,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const court = await this.prisma.court.findUnique({
      where: { id },
      include: this.courtInclude,
    });

    if (!court) {
      throw new NotFoundException('Campo não encontrado.');
    }

    return court;
  }

  async create(createCourtDto: CreateCourtDto) {
    await this.validateClubExists(createCourtDto.clubId);
    await this.validateCourtNameIsUnique(
      createCourtDto.clubId,
      createCourtDto.name,
    );

    return this.prisma.court.create({
      data: {
        clubId: createCourtDto.clubId,
        name: createCourtDto.name.trim(),
        description: createCourtDto.description?.trim(),
        location: createCourtDto.location?.trim(),
        surfaceType: createCourtDto.surfaceType,
        courtType: createCourtDto.courtType,
        environment: createCourtDto.environment,
        hourlyPrice: createCourtDto.hourlyPrice,
        isActive: createCourtDto.isActive,
      },
      include: this.courtInclude,
    });
  }

  async update(id: string, updateCourtDto: UpdateCourtDto) {
    const existingCourt = await this.findOne(id);

    const targetClubId = updateCourtDto.clubId ?? existingCourt.clubId;
    const targetName = updateCourtDto.name?.trim() ?? existingCourt.name;

    if (updateCourtDto.clubId) {
      await this.validateClubExists(updateCourtDto.clubId);
    }

    if (
      targetClubId !== existingCourt.clubId ||
      targetName !== existingCourt.name
    ) {
      await this.validateCourtNameIsUnique(
        targetClubId,
        targetName,
        existingCourt.id,
      );
    }

    return this.prisma.court.update({
      where: { id },
      data: {
        clubId: updateCourtDto.clubId,
        name: updateCourtDto.name?.trim(),
        description:
          updateCourtDto.description !== undefined
            ? updateCourtDto.description?.trim()
            : undefined,
        location:
          updateCourtDto.location !== undefined
            ? updateCourtDto.location?.trim()
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

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.court.delete({
      where: { id },
      include: this.courtInclude,
    });
  }

  private async validateClubExists(clubId: string) {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true },
    });

    if (!club) {
      throw new NotFoundException('Clube não encontrado.');
    }
  }

  private async validateCourtNameIsUnique(
    clubId: string,
    name: string,
    ignoredCourtId?: string,
  ) {
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
        'Já existe um campo com este nome no clube indicado.',
      );
    }
  }
}