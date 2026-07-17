import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userSelect = {
  id: true,
  roleId: true,
  email: true,
  firstName: true,
  lastName: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();

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

    await this.ensureRoleExists(createUserDto.roleId);

    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      12,
    );

    return this.prisma.user.create({
      data: {
        roleId: createUserDto.roleId,
        email: normalizedEmail,
        passwordHash,
        firstName: createUserDto.firstName.trim(),
        lastName: createUserDto.lastName.trim(),
        isActive: createUserDto.isActive ?? true,
      },
      select: userSelect,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: userSelect,
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
        roleId: updateUserDto.roleId,
        email: normalizedEmail,
        passwordHash,
        firstName:
          updateUserDto.firstName?.trim(),
        lastName:
          updateUserDto.lastName?.trim(),
        isActive: updateUserDto.isActive,
      },
      select: userSelect,
    });
  }

  async remove(id: string) {
    await this.ensureUserExists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
      select: userSelect,
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