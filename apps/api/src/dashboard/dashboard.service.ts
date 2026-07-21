import { Injectable } from '@nestjs/common';
import { ReservationStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devolve os principais indicadores para o dashboard.
   */
  async getSummary() {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [
      totalMembers,
      activeMembers,
      totalCoaches,
      activeCoaches,
      totalCourts,
      activeCourts,
      todayReservations,
      upcomingReservations,
      cancelledToday,
    ] = await Promise.all([
      this.prisma.member.count(),

      this.prisma.member.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.coach.count(),

      this.prisma.coach.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.court.count(),

      this.prisma.court.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.reservation.count({
        where: {
          startTime: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
          status: {
            not: ReservationStatus.CANCELLED,
          },
        },
      }),

      this.prisma.reservation.count({
        where: {
          startTime: {
            gte: now,
          },
          status: {
            not: ReservationStatus.CANCELLED,
          },
        },
      }),

      this.prisma.reservation.count({
        where: {
          cancelledAt: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
          status: ReservationStatus.CANCELLED,
        },
      }),
    ]);

    return {
      members: {
        total: totalMembers,
        active: activeMembers,
      },
      coaches: {
        total: totalCoaches,
        active: activeCoaches,
      },
      courts: {
        total: totalCourts,
        active: activeCourts,
      },
      reservations: {
        today: todayReservations,
        upcoming: upcomingReservations,
        cancelledToday,
      },
    };
  }
}