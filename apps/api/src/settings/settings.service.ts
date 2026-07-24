import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClubSettingsDto } from './dto/update-club-settings.dto';

const clubSelect = {
  id: true,
  name: true,
  slug: true,
  email: true,
  phone: true,
  website: true,
  description: true,
  taxNumber: true,
  address: true,
  postalCode: true,
  city: true,
  district: true,
  country: true,
  logoUrl: true,
  primaryColor: true,
  secondaryColor: true,
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClubSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { clubId: true },
    });
    if (!user) throw new NotFoundException('O utilizador autenticado não foi encontrado.');

    const club = await this.prisma.club.findUnique({
      where: { id: user.clubId },
      select: clubSelect,
    });
    if (!club) throw new NotFoundException('O clube associado não foi encontrado.');
    return club;
  }

  async updateClubSettings(userId: string, dto: UpdateClubSettingsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { clubId: true },
    });
    if (!user) throw new NotFoundException('O utilizador autenticado não foi encontrado.');

    return this.prisma.club.update({
      where: { id: user.clubId },
      data: {
        name: dto.name?.trim(),
        email: this.normalizeOptional(dto.email),
        phone: this.normalizeOptional(dto.phone),
        address: this.normalizeOptional(dto.address),
        postalCode: this.normalizeOptional(dto.postalCode),
        city: this.normalizeOptional(dto.city),
        district: this.normalizeOptional(dto.district),
        country: this.normalizeOptional(dto.country),
        website: this.normalizeOptional(dto.website),
        description: this.normalizeOptional(dto.description),
      },
      select: clubSelect,
    });
  }

  private normalizeOptional(value: string | null | undefined) {
    if (value === undefined) return undefined;
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }
}
