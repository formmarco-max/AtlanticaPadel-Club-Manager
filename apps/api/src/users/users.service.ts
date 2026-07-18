import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { USER_SELECT } from './constants/user-select.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email
      .trim()
      .toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Já existe um utilizador com este endereço de email.',
      );
    }

    await this.ensureClubExists(createUserDto.clubId);
    await this.ensureRoleExists(createUserDto.roleId);

    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      12,
    );

    return this.prisma.user.create({
      data: {
        clubId: createUserDto.clubId,
        roleId: createUserDto.roleId,
        email: normalizedEmail,
        passwordHash,
        firstName: createUserDto.firstName.trim(),
        lastName: createUserDto.lastName.trim(),
        isActive: createUserDto.isActive ?? true,
      },
      select: USER_SELECT,
    });
  }

  async findAll(queryDto: UsersQueryDto) {
    const {
      page = 1,
      limit = 10,
      q,
      role,
      active,
      sort = 'createdAt',
      order = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;
    const search = q?.trim();

    const where: Prisma.UserWhereInput = {
      ...(typeof active === 'boolean'
        ? {
            isActive: active,
          }
        : {}),

      ...(role
        ? {
            role: {
              name: {
                equals: role,
                mode: 'insensitive',
              },
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sort]: order,
    };

    const [users, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: USER_SELECT,
        orderBy: [
          orderBy,
          {
            id: 'asc',
          },
        ],
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: users,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException(
        'O utilizador solicitado não foi encontrado.',
      );
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    await this.ensureUserExists(id);

    if (updateUserDto.clubId) {
      await this.ensureClubExists(updateUserDto.clubId);
    }

    if (updateUserDto.roleId) {
      await this.ensureRoleExists(updateUserDto.roleId);
    }

    let normalizedEmail: string | undefined;

    if (updateUserDto.email) {
      normalizedEmail = updateUserDto.email
        .trim()
        .toLowerCase();

      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'Já existe outro utilizador com este endereço de email.',
        );
      }
    }

    const passwordHash = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 12)
      : undefined;

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        clubId: updateUserDto.clubId,
        roleId: updateUserDto.roleId,
        email: normalizedEmail,
        passwordHash,
        firstName: updateUserDto.firstName?.trim(),
        lastName: updateUserDto.lastName?.trim(),
        isActive: updateUserDto.isActive,
      },
      select: USER_SELECT,
    });
  }

  async remove(id: string) {
    await this.ensureUserExists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
      select: USER_SELECT,
    });
  }

  private async ensureUserExists(
    id: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'O utilizador solicitado não foi encontrado.',
      );
    }
  }

  private async ensureClubExists(
    clubId: string,
  ): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        id: true,
      },
    });

    if (!club) {
      throw new NotFoundException(
        'O clube indicado não foi encontrado.',
      );
    }
  }

  private async ensureRoleExists(
    roleId: string,
  ): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      throw new NotFoundException(
        'O perfil de utilizador indicado não foi encontrado.',
      );
    }
  }
}