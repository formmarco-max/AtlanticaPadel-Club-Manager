import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userSelect = {
  id: true,
  clubId: true,
  roleId: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
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

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user || !user.isActive) {
      throw new NotFoundException(
        'O perfil do utilizador não foi encontrado.',
      );
    }

    return this.toProfileResponse(user);
  }

  async updateMyProfile(userId: string, dto: UpdateMyProfileDto) {
    await this.ensureAuthenticatedUserExists(userId);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
      },
      select: userSelect,
    });

    return this.toProfileResponse(user);
  }

  async updateMyAvatar(userId: string, file: Express.Multer.File) {
    await this.ensureAuthenticatedUserExists(userId);

    const relativeDirectory = join('uploads', 'users', userId);
    const absoluteDirectory = join(process.cwd(), relativeDirectory);
    const absoluteFilePath = join(absoluteDirectory, 'avatar.webp');
    const avatarUrl = `/${relativeDirectory.replaceAll('\\', '/')}/avatar.webp`;

    await mkdir(absoluteDirectory, { recursive: true });

    await sharp(file.buffer)
      .rotate()
      .resize(512, 512, {
        fit: 'cover',
        position: 'centre',
      })
      .webp({ quality: 82 })
      .toFile(absoluteFilePath);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: userSelect,
    });

    return this.toProfileResponse(user);
  }

  async removeMyAvatar(userId: string): Promise<void> {
    await this.ensureAuthenticatedUserExists(userId);

    await rm(join(process.cwd(), 'uploads', 'users', userId), {
      recursive: true,
      force: true,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });
  }

  async create(clubId: string, dto: CreateUserDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException(
        'Já existe um utilizador com este endereço de email.',
      );
    }

    await this.ensureRoleExists(dto.roleId);

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        clubId,
        roleId: dto.roleId,
        email: normalizedEmail,
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        isActive: dto.isActive ?? true,
      },
      select: userSelect,
    });
  }

  findAll(clubId: string) {
    return this.prisma.user.findMany({
      where: { clubId },
      select: userSelect,
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });
  }

  async findOne(clubId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        clubId,
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

  async update(clubId: string, id: string, dto: UpdateUserDto) {
    await this.ensureManagedUserExists(clubId, id);

    if (dto.roleId) {
      await this.ensureRoleExists(dto.roleId);
    }

    let normalizedEmail: string | undefined;

    if (dto.email !== undefined) {
      normalizedEmail = dto.email.trim().toLowerCase();

      const duplicate = await this.prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id },
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new ConflictException(
          'Já existe outro utilizador com este endereço de email.',
        );
      }
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 12)
      : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        roleId: dto.roleId,
        email: normalizedEmail,
        passwordHash,
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        isActive: dto.isActive,
      },
      select: userSelect,
    });
  }

  async remove(clubId: string, id: string): Promise<void> {
    await this.ensureManagedUserExists(clubId, id);

    await this.prisma.user.delete({
      where: { id },
    });

    await rm(join(process.cwd(), 'uploads', 'users', id), {
      recursive: true,
      force: true,
    });
  }

  private async ensureAuthenticatedUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new NotFoundException(
        'O perfil do utilizador não foi encontrado.',
      );
    }
  }

  private async ensureManagedUserExists(
    clubId: string,
    id: string,
  ): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        clubId,
      },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(
        'O utilizador solicitado não foi encontrado.',
      );
    }
  }

  private async ensureRoleExists(roleId: string): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      select: { id: true },
    });

    if (!role) {
      throw new NotFoundException(
        'O perfil de utilizador indicado não foi encontrado.',
      );
    }
  }

  private toProfileResponse(user: {
    id: string;
    clubId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    role: { name: string };
  }) {
    return {
      id: user.id,
      clubId: user.clubId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
    };
  }
}
