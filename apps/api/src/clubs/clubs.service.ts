import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.club.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    await this.ensureClubExists(id);

    return this.prisma.club.findUnique({
      where: {
        id,
      },
    });
  }

  async create(createClubDto: CreateClubDto) {
    await this.ensureUniqueFields(
      createClubDto.name,
      createClubDto.slug,
    );

    return this.prisma.club.create({
      data: createClubDto,
    });
  }

  async update(id: string, updateClubDto: UpdateClubDto) {
    await this.ensureClubExists(id);

    if (updateClubDto.name || updateClubDto.slug) {
      await this.ensureUniqueFields(
        updateClubDto.name,
        updateClubDto.slug,
        id,
      );
    }

    return this.prisma.club.update({
      where: {
        id,
      },
      data: updateClubDto,
    });
  }

  async remove(id: string) {
    await this.ensureClubExists(id);

    return this.prisma.club.delete({
      where: {
        id,
      },
    });
  }

  private async ensureClubExists(id: string): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!club) {
      throw new NotFoundException(`Clube com ID "${id}" não foi encontrado`);
    }
  }

  private async ensureUniqueFields(
    name?: string,
    slug?: string,
    ignoredClubId?: string,
  ): Promise<void> {
    const conditions = [];

    if (name) {
      conditions.push({ name });
    }

    if (slug) {
      conditions.push({ slug });
    }

    if (conditions.length === 0) {
      return;
    }

    const existingClub = await this.prisma.club.findFirst({
      where: {
        OR: conditions,
        ...(ignoredClubId
          ? {
              id: {
                not: ignoredClubId,
              },
            }
          : {}),
      },
      select: {
        name: true,
        slug: true,
      },
    });

    if (!existingClub) {
      return;
    }

    if (name && existingClub.name === name) {
      throw new ConflictException(
        `Um clube com o nome "${name}" já existe`,
      );
    }

    if (slug && existingClub.slug === slug) {
      throw new ConflictException(
        `Um clube com o identificador "${slug}" já existe`,
      );
    }
  }
}