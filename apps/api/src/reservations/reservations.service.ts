import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReservationStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  private readonly clubTimeZone = 'Europe/Lisbon';

  private readonly reservationInclude = {
    club: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    court: {
      select: {
        id: true,
        name: true,
        location: true,
        surfaceType: true,
        courtType: true,
        environment: true,
        hourlyPrice: true,
        openingTime: true,
        closingTime: true,
        defaultReservationDuration: true,
        reservationInterval: true,
        hasLighting: true,
        isActive: true,
        isUnderMaintenance: true,
      },
    },
    member: {
      select: {
        id: true,
        membershipNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isActive: true,
      },
    },
  } satisfies Prisma.ReservationInclude;

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reservation.findMany({
      include: this.reservationInclude,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: this.reservationInclude,
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    return reservation;
  }

  async create(createReservationDto: CreateReservationDto) {
    const startTime = new Date(createReservationDto.startTime);
    const endTime = new Date(createReservationDto.endTime);

    this.validateInitialStatus(createReservationDto.status);
    this.validateDateRange(startTime, endTime);

    const court = await this.validateCourt(
      createReservationDto.courtId,
      createReservationDto.clubId,
    );

    await this.validateClubExists(createReservationDto.clubId);

    await this.validateMember(
      createReservationDto.memberId,
      createReservationDto.clubId,
    );

    this.validateReservationIsInFuture(startTime);
    this.validateCourtAvailability(court);
    this.validateReservationSchedule(startTime, endTime, court);
    this.validateReservationDuration(startTime, endTime, court);

    await this.validateReservationDoesNotOverlap(
      createReservationDto.courtId,
      startTime,
      endTime,
      court.reservationInterval,
    );

    const totalPrice =
      createReservationDto.totalPrice ??
      this.calculateTotalPrice(startTime, endTime, court.hourlyPrice);

    return this.prisma.reservation.create({
      data: {
        clubId: createReservationDto.clubId,
        courtId: createReservationDto.courtId,
        memberId: createReservationDto.memberId,
        startTime,
        endTime,
        status:
          createReservationDto.status ?? ReservationStatus.CONFIRMED,
        totalPrice,
        notes: createReservationDto.notes?.trim(),
      },
      include: this.reservationInclude,
    });
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    const existingReservation = await this.findOne(id);

    const clubId =
      updateReservationDto.clubId ?? existingReservation.clubId;

    const courtId =
      updateReservationDto.courtId ?? existingReservation.courtId;

    const memberId =
      updateReservationDto.memberId ?? existingReservation.memberId;

    const startTime = updateReservationDto.startTime
      ? new Date(updateReservationDto.startTime)
      : existingReservation.startTime;

    const endTime = updateReservationDto.endTime
      ? new Date(updateReservationDto.endTime)
      : existingReservation.endTime;

    const status =
      updateReservationDto.status ?? existingReservation.status;

    this.validateDateRange(startTime, endTime);

    await this.validateClubExists(clubId);

    const court = await this.validateCourt(courtId, clubId);

    await this.validateMember(memberId, clubId);

    if (this.isBlockingStatus(status)) {
      this.validateReservationIsInFuture(startTime);
      this.validateCourtAvailability(court);
      this.validateReservationSchedule(startTime, endTime, court);
      this.validateReservationDuration(startTime, endTime, court);

      await this.validateReservationDoesNotOverlap(
        courtId,
        startTime,
        endTime,
        court.reservationInterval,
        id,
      );
    }

    const shouldRecalculatePrice =
      updateReservationDto.totalPrice === undefined &&
      (updateReservationDto.startTime !== undefined ||
        updateReservationDto.endTime !== undefined ||
        updateReservationDto.courtId !== undefined);

    const totalPrice =
      updateReservationDto.totalPrice !== undefined
        ? updateReservationDto.totalPrice
        : shouldRecalculatePrice
          ? this.calculateTotalPrice(
              startTime,
              endTime,
              court.hourlyPrice,
            )
          : undefined;

    const isBeingCancelled =
      status === ReservationStatus.CANCELLED &&
      existingReservation.status !== ReservationStatus.CANCELLED;

    const isBeingReactivated =
      status !== ReservationStatus.CANCELLED &&
      existingReservation.status === ReservationStatus.CANCELLED;

    return this.prisma.reservation.update({
      where: { id },
      data: {
        clubId: updateReservationDto.clubId,
        courtId: updateReservationDto.courtId,
        memberId: updateReservationDto.memberId,
        startTime:
          updateReservationDto.startTime !== undefined
            ? startTime
            : undefined,
        endTime:
          updateReservationDto.endTime !== undefined
            ? endTime
            : undefined,
        status: updateReservationDto.status,
        totalPrice,
        notes:
          updateReservationDto.notes !== undefined
            ? updateReservationDto.notes.trim()
            : undefined,
        cancelledAt: isBeingCancelled
          ? new Date()
          : isBeingReactivated
            ? null
            : undefined,
        cancellationReason: isBeingReactivated ? null : undefined,
      },
      include: this.reservationInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reservation.delete({
      where: { id },
      include: this.reservationInclude,
    });
  }

  private async validateClubExists(clubId: string) {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!club) {
      throw new NotFoundException('Clube não encontrado.');
    }

    if (!club.isActive) {
      throw new BadRequestException(
        'Não é possível criar reservas num clube inativo.',
      );
    }
  }

  private async validateCourt(courtId: string, clubId: string) {
    const court = await this.prisma.court.findUnique({
      where: { id: courtId },
      select: {
        id: true,
        clubId: true,
        hourlyPrice: true,
        openingTime: true,
        closingTime: true,
        defaultReservationDuration: true,
        reservationInterval: true,
        isActive: true,
        isUnderMaintenance: true,
        maintenanceNotes: true,
      },
    });

    if (!court) {
      throw new NotFoundException('Campo não encontrado.');
    }

    if (court.clubId !== clubId) {
      throw new BadRequestException(
        'O campo indicado não pertence ao clube da reserva.',
      );
    }

    return court;
  }

  private async validateMember(memberId: string, clubId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        clubId: true,
        isActive: true,
      },
    });

    if (!member) {
      throw new NotFoundException('Sócio não encontrado.');
    }

    if (member.clubId !== clubId) {
      throw new BadRequestException(
        'O sócio indicado não pertence ao clube da reserva.',
      );
    }

    if (!member.isActive) {
      throw new BadRequestException(
        'Não é possível criar uma reserva para um sócio inativo.',
      );
    }
  }

  private validateInitialStatus(status?: ReservationStatus) {
    if (
      status !== undefined &&
      status !== ReservationStatus.PENDING &&
      status !== ReservationStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Uma nova reserva apenas pode ser criada com o estado PENDING ou CONFIRMED.',
      );
    }
  }

  private validateDateRange(startTime: Date, endTime: Date) {
    if (
      Number.isNaN(startTime.getTime()) ||
      Number.isNaN(endTime.getTime())
    ) {
      throw new BadRequestException(
        'As datas da reserva não são válidas.',
      );
    }

    if (endTime <= startTime) {
      throw new BadRequestException(
        'A data e hora de fim devem ser posteriores à data e hora de início.',
      );
    }
  }

  private validateReservationIsInFuture(startTime: Date) {
    if (startTime <= new Date()) {
      throw new BadRequestException(
        'Não é possível criar ou ativar uma reserva no passado.',
      );
    }
  }

  private validateCourtAvailability(court: {
    isActive: boolean;
    isUnderMaintenance: boolean;
    maintenanceNotes: string | null;
  }) {
    if (!court.isActive) {
      throw new BadRequestException(
        'O campo indicado encontra-se inativo.',
      );
    }

    if (court.isUnderMaintenance) {
      const maintenanceInformation = court.maintenanceNotes
        ? ` Motivo: ${court.maintenanceNotes}`
        : '';

      throw new BadRequestException(
        `O campo indicado encontra-se em manutenção.${maintenanceInformation}`,
      );
    }
  }

  private validateReservationSchedule(
    startTime: Date,
    endTime: Date,
    court: {
      openingTime: string;
      closingTime: string;
    },
  ) {
    const startDate = this.getDateKeyInClubTimeZone(startTime);
    const endDate = this.getDateKeyInClubTimeZone(endTime);

    if (startDate !== endDate) {
      throw new BadRequestException(
        'A reserva deve começar e terminar no mesmo dia.',
      );
    }

    const startMinutes = this.getMinutesInClubTimeZone(startTime);
    const endMinutes = this.getMinutesInClubTimeZone(endTime);
    const openingMinutes = this.timeStringToMinutes(
      court.openingTime,
    );
    const closingMinutes = this.timeStringToMinutes(
      court.closingTime,
    );

    if (startMinutes < openingMinutes || endMinutes > closingMinutes) {
      throw new BadRequestException(
        `A reserva deve estar compreendida entre as ${court.openingTime} e as ${court.closingTime}.`,
      );
    }
  }

  private validateReservationDuration(
    startTime: Date,
    endTime: Date,
    court: {
      defaultReservationDuration: number;
    },
  ) {
    const durationInMinutes =
      (endTime.getTime() - startTime.getTime()) / 60_000;

    if (durationInMinutes !== court.defaultReservationDuration) {
      throw new BadRequestException(
        `A duração da reserva deve ser de ${court.defaultReservationDuration} minutos.`,
      );
    }
  }

  private async validateReservationDoesNotOverlap(
    courtId: string,
    startTime: Date,
    endTime: Date,
    reservationInterval: number,
    ignoredReservationId?: string,
  ) {
    const intervalInMilliseconds = reservationInterval * 60_000;

    const endTimeWithInterval = new Date(
      endTime.getTime() + intervalInMilliseconds,
    );

    const startTimeWithoutInterval = new Date(
      startTime.getTime() - intervalInMilliseconds,
    );

    const conflictingReservation =
      await this.prisma.reservation.findFirst({
        where: {
          courtId,
          id: ignoredReservationId
            ? {
                not: ignoredReservationId,
              }
            : undefined,
          status: {
            in: [
              ReservationStatus.PENDING,
              ReservationStatus.CONFIRMED,
            ],
          },
          startTime: {
            lt: endTimeWithInterval,
          },
          endTime: {
            gt: startTimeWithoutInterval,
          },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        },
      });

    if (conflictingReservation) {
      throw new ConflictException(
        'O campo já possui uma reserva nesse período ou no intervalo de segurança definido.',
      );
    }
  }

  private calculateTotalPrice(
    startTime: Date,
    endTime: Date,
    hourlyPrice: Prisma.Decimal | null,
  ) {
    if (hourlyPrice === null) {
      return undefined;
    }

    const durationInHours =
      (endTime.getTime() - startTime.getTime()) / 3_600_000;

    const calculatedPrice =
      Number(hourlyPrice.toString()) * durationInHours;

    return Number(calculatedPrice.toFixed(2));
  }

  private timeStringToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }

  private getDateKeyInClubTimeZone(date: Date) {
    const parts = this.getDateTimePartsInClubTimeZone(date);

    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  private getMinutesInClubTimeZone(date: Date) {
    const parts = this.getDateTimePartsInClubTimeZone(date);

    return Number(parts.hour) * 60 + Number(parts.minute);
  }

  private getDateTimePartsInClubTimeZone(date: Date) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.clubTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    const parts = formatter.formatToParts(date);

    return parts.reduce<Record<string, string>>((result, part) => {
      if (part.type !== 'literal') {
        result[part.type] = part.value;
      }

      return result;
    }, {});
  }

  private isBlockingStatus(status: ReservationStatus) {
    return (
      status === ReservationStatus.PENDING ||
      status === ReservationStatus.CONFIRMED
    );
  }
}