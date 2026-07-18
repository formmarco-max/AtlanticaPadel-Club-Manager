import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

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
}