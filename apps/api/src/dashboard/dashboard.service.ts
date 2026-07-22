import { Injectable } from '@nestjs/common';
import { ReservationStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type PaymentStatus = 'PAID' | 'PENDING';

export interface DashboardReservation {
  id: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  court: {
    id: string;
    name: string;
    location: string | null;
  };
}

interface CourtStatistics {
  courtId: string;
  courtName: string;
  reservations: number;
  revenue: number;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devolve os principais indicadores operacionais e financeiros
   * utilizados no dashboard.
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
      upcomingReservationsCount,
      cancelledToday,
      upcomingReservations,
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

      this.prisma.reservation.findMany({
        where: {
          startTime: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
          status: {
            not: ReservationStatus.CANCELLED,
          },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          totalPrice: true,
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          court: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: [
          {
            startTime: 'asc',
          },
          {
            court: {
              name: 'asc',
            },
          },
        ],
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

      this.prisma.reservation.findMany({
        where: {
          startTime: {
            gte: startOfTomorrow,
          },
          status: {
            not: ReservationStatus.CANCELLED,
          },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          totalPrice: true,
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          court: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 8,
      }),
    ]);

    const todaySchedule = todayReservations.map((reservation) =>
      this.mapReservation(reservation),
    );

    const nextReservations = upcomingReservations.map((reservation) =>
      this.mapReservation(reservation),
    );

    const billedToday = this.roundCurrency(
      todaySchedule.reduce(
        (total, reservation) => total + reservation.totalPrice,
        0,
      ),
    );

    const paidToday = this.roundCurrency(
      todaySchedule
        .filter(
          (reservation) => reservation.paymentStatus === 'PAID',
        )
        .reduce(
          (total, reservation) => total + reservation.totalPrice,
          0,
        ),
    );

    const pendingToday = this.roundCurrency(
      todaySchedule
        .filter(
          (reservation) => reservation.paymentStatus === 'PENDING',
        )
        .reduce(
          (total, reservation) => total + reservation.totalPrice,
          0,
        ),
    );

    const collectionRate =
      billedToday > 0
        ? this.roundPercentage((paidToday / billedToday) * 100)
        : 0;

    const averageTicket =
      todaySchedule.length > 0
        ? this.roundCurrency(billedToday / todaySchedule.length)
        : 0;

    const courtStatistics = this.calculateCourtStatistics(todaySchedule);

    const mostUsedCourt = [...courtStatistics].sort(
      (firstCourt, secondCourt) =>
        secondCourt.reservations - firstCourt.reservations,
    )[0];

    const highestRevenueCourt = [...courtStatistics].sort(
      (firstCourt, secondCourt) =>
        secondCourt.revenue - firstCourt.revenue,
    )[0];

    const peakHour = this.calculatePeakHour(todaySchedule);

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
        today: todaySchedule.length,
        upcoming: upcomingReservationsCount,
        cancelledToday,
      },
      finance: {
        billedToday,
        paidToday,
        pendingToday,
        collectionRate,
        averageTicket,
      },
      operational: {
        mostUsedCourt: mostUsedCourt
          ? {
              id: mostUsedCourt.courtId,
              name: mostUsedCourt.courtName,
              reservations: mostUsedCourt.reservations,
            }
          : null,
        highestRevenueCourt: highestRevenueCourt
          ? {
              id: highestRevenueCourt.courtId,
              name: highestRevenueCourt.courtName,
              revenue: highestRevenueCourt.revenue,
            }
          : null,
        peakHour,
      },
      todaySchedule,
      upcomingReservations: nextReservations,
    };
  }

  /**
   * Converte uma reserva Prisma no formato utilizado pelo dashboard.
   */
  private mapReservation(reservation: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: ReservationStatus;
    totalPrice: unknown;
    member: {
      id: string;
      firstName: string;
      lastName: string;
    };
    court: {
      id: string;
      name: string;
      location: string | null;
    };
  }): DashboardReservation {
    return {
      id: reservation.id,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      totalPrice: this.decimalToNumber(reservation.totalPrice),
      paymentStatus: this.getPaymentStatus(
        reservation.id,
        reservation.status,
      ),
      member: {
        id: reservation.member.id,
        firstName: reservation.member.firstName,
        lastName: reservation.member.lastName,
        fullName:
          `${reservation.member.firstName} ${reservation.member.lastName}`.trim(),
      },
      court: {
        id: reservation.court.id,
        name: reservation.court.name,
        location: reservation.court.location,
      },
    };
  }

  /**
   * Devolve um estado de pagamento fictício, mas determinístico.
   *
   * A mesma reserva mantém sempre o mesmo estado enquanto não existir
   * um módulo real de pagamentos.
   */
  private getPaymentStatus(
    reservationId: string,
    reservationStatus: ReservationStatus,
  ): PaymentStatus {
    if (reservationStatus === ReservationStatus.COMPLETED) {
      return 'PAID';
    }

    if (
      reservationStatus === ReservationStatus.PENDING ||
      reservationStatus === ReservationStatus.NO_SHOW
    ) {
      return 'PENDING';
    }

    const reservationHash = [...reservationId].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    );

    return reservationHash % 4 === 0 ? 'PENDING' : 'PAID';
  }

  /**
   * Calcula utilização e faturação de cada campo durante o dia.
   */
  private calculateCourtStatistics(
    reservations: DashboardReservation[],
  ): CourtStatistics[] {
    const statistics = new Map<string, CourtStatistics>();

    reservations.forEach((reservation) => {
      const existingStatistics = statistics.get(reservation.court.id);

      if (existingStatistics) {
        existingStatistics.reservations += 1;
        existingStatistics.revenue = this.roundCurrency(
          existingStatistics.revenue + reservation.totalPrice,
        );

        return;
      }

      statistics.set(reservation.court.id, {
        courtId: reservation.court.id,
        courtName: reservation.court.name,
        reservations: 1,
        revenue: reservation.totalPrice,
      });
    });

    return Array.from(statistics.values());
  }

  /**
   * Identifica a hora com mais reservas iniciadas.
   */
  private calculatePeakHour(
    reservations: DashboardReservation[],
  ): {
    hour: number;
    label: string;
    reservations: number;
  } | null {
    if (reservations.length === 0) {
      return null;
    }

    const reservationsByHour = new Map<number, number>();

    reservations.forEach((reservation) => {
      const hour = reservation.startTime.getHours();

      reservationsByHour.set(
        hour,
        (reservationsByHour.get(hour) ?? 0) + 1,
      );
    });

    const peakHourEntry = Array.from(
      reservationsByHour.entries(),
    ).sort(
      ([firstHour, firstCount], [secondHour, secondCount]) =>
        secondCount - firstCount || firstHour - secondHour,
    )[0];

    const [hour, reservationCount] = peakHourEntry;

    return {
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      reservations: reservationCount,
    };
  }

  /**
   * Converte valores Decimal, string ou number para number.
   */
  private decimalToNumber(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number(value);

      return Number.isNaN(parsedValue) ? 0 : parsedValue;
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      'toNumber' in value &&
      typeof value.toNumber === 'function'
    ) {
      return value.toNumber();
    }

    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? 0 : parsedValue;
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private roundPercentage(value: number): number {
    return Math.round((value + Number.EPSILON) * 10) / 10;
  }
}