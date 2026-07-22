import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import {
  CourtEnvironment,
  CourtSurfaceType,
  CourtType,
  Prisma,
  PrismaClient,
  ReservationStatus,
} from '../../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'A variável de ambiente DATABASE_URL não está configurada.',
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

interface MemberSeed {
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  joinDate: Date;
  notes?: string;
  isActive: boolean;
}

interface CoachSeed {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  biography: string;
  hireDate: Date;
  isActive: boolean;
}

interface CourtSeed {
  name: string;
  description: string;
  location: string;
  surfaceType: CourtSurfaceType;
  courtType: CourtType;
  environment: CourtEnvironment;
  hourlyPrice: number;
  openingTime: string;
  closingTime: string;
  defaultReservationDuration: number;
  reservationInterval: number;
  hasLighting: boolean;
  isUnderMaintenance: boolean;
  maintenanceNotes?: string;
  isActive: boolean;
}

/**
 * Cria uma data sem depender de strings interpretadas pelo runtime.
 */
function createDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date {
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

/**
 * Cria uma data relativamente ao dia atual.
 */
function createRelativeDate(
  dayOffset: number,
  hour: number,
  minute = 0,
): Date {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);

  return date;
}

/**
 * Acrescenta minutos a uma data.
 */
function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Seleciona ciclicamente um elemento de uma lista.
 */
function getCyclicItem<T>(items: T[], index: number): T {
  const item = items[index % items.length];

  if (!item) {
    throw new Error('Não foi possível selecionar um elemento da lista.');
  }

  return item;
}

async function seedClub() {
  const existingClub = await prisma.club.findFirst({
    where: {
      OR: [
        {
          slug: 'atlantica-padel-club',
        },
        {
          name: 'Atlantica Padel Club',
        },
      ],
    },
  });

  if (existingClub) {
    return prisma.club.update({
      where: {
        id: existingClub.id,
      },
      data: {
        name: 'Atlantica Padel Club',
        slug: 'atlantica-padel-club',
        email: 'geral@atlanticapadel.pt',
        phone: '+351 214 000 100',
        website: 'https://www.atlanticapadel.pt',
        description:
          'Clube dedicado à prática de padel, formação, competição e organização de eventos.',
        taxNumber: '516123456',
        address: 'Rua do Atlântico, 25',
        postalCode: '2730-036',
        city: 'Barcarena',
        district: 'Lisboa',
        country: 'Portugal',
        logoUrl: '/images/logo-apcm.png',
        primaryColor: '#063763',
        secondaryColor: '#10B981',
        isActive: true,
      },
    });
  }

  return prisma.club.create({
    data: {
      name: 'Atlantica Padel Club',
      slug: 'atlantica-padel-club',
      email: 'geral@atlanticapadel.pt',
      phone: '+351 214 000 100',
      website: 'https://www.atlanticapadel.pt',
      description:
        'Clube dedicado à prática de padel, formação, competição e organização de eventos.',
      taxNumber: '516123456',
      address: 'Rua do Atlântico, 25',
      postalCode: '2730-036',
      city: 'Barcarena',
      district: 'Lisboa',
      country: 'Portugal',
      logoUrl: '/images/logo-apcm.png',
      primaryColor: '#063763',
      secondaryColor: '#10B981',
      isActive: true,
    },
  });
}

function getMembers(): MemberSeed[] {
  return [
    {
      membershipNumber: 'APCM-1001',
      firstName: 'Ana',
      lastName: 'Martins',
      email: 'ana.martins@example.pt',
      phone: '+351 912 101 001',
      birthDate: createDate(1992, 3, 14),
      joinDate: createDate(2024, 1, 10),
      notes: 'Prefere reservas ao final da tarde.',
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1002',
      firstName: 'João',
      lastName: 'Ferreira',
      email: 'joao.ferreira@example.pt',
      phone: '+351 912 101 002',
      birthDate: createDate(1988, 7, 22),
      joinDate: createDate(2024, 1, 18),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1003',
      firstName: 'Miguel',
      lastName: 'Costa',
      email: 'miguel.costa@example.pt',
      phone: '+351 912 101 003',
      birthDate: createDate(1995, 11, 8),
      joinDate: createDate(2024, 2, 4),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1004',
      firstName: 'Sofia',
      lastName: 'Almeida',
      email: 'sofia.almeida@example.pt',
      phone: '+351 912 101 004',
      birthDate: createDate(1997, 5, 19),
      joinDate: createDate(2024, 2, 17),
      notes: 'Participa regularmente em torneios internos.',
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1005',
      firstName: 'Ricardo',
      lastName: 'Santos',
      email: 'ricardo.santos@example.pt',
      phone: '+351 912 101 005',
      birthDate: createDate(1985, 9, 3),
      joinDate: createDate(2024, 3, 2),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1006',
      firstName: 'Marta',
      lastName: 'Rodrigues',
      email: 'marta.rodrigues@example.pt',
      phone: '+351 912 101 006',
      birthDate: createDate(1990, 12, 27),
      joinDate: createDate(2024, 3, 21),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1007',
      firstName: 'Pedro',
      lastName: 'Carvalho',
      email: 'pedro.carvalho@example.pt',
      phone: '+351 912 101 007',
      birthDate: createDate(1987, 1, 16),
      joinDate: createDate(2024, 4, 9),
      notes: 'Solicitou informação sobre aulas avançadas.',
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1008',
      firstName: 'Inês',
      lastName: 'Lopes',
      email: 'ines.lopes@example.pt',
      phone: '+351 912 101 008',
      birthDate: createDate(1998, 8, 11),
      joinDate: createDate(2024, 4, 23),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1009',
      firstName: 'Tiago',
      lastName: 'Pereira',
      email: 'tiago.pereira@example.pt',
      phone: '+351 912 101 009',
      birthDate: createDate(1993, 4, 6),
      joinDate: createDate(2024, 5, 12),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1010',
      firstName: 'Beatriz',
      lastName: 'Sousa',
      email: 'beatriz.sousa@example.pt',
      phone: '+351 912 101 010',
      birthDate: createDate(1996, 10, 2),
      joinDate: createDate(2024, 5, 28),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1011',
      firstName: 'André',
      lastName: 'Moreira',
      email: 'andre.moreira@example.pt',
      phone: '+351 912 101 011',
      birthDate: createDate(1989, 6, 13),
      joinDate: createDate(2024, 6, 5),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1012',
      firstName: 'Carolina',
      lastName: 'Mendes',
      email: 'carolina.mendes@example.pt',
      phone: '+351 912 101 012',
      birthDate: createDate(1994, 2, 24),
      joinDate: createDate(2024, 6, 19),
      notes: 'Nível intermédio.',
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1013',
      firstName: 'Diogo',
      lastName: 'Ramos',
      email: 'diogo.ramos@example.pt',
      phone: '+351 912 101 013',
      birthDate: createDate(1991, 7, 30),
      joinDate: createDate(2024, 7, 7),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1014',
      firstName: 'Mariana',
      lastName: 'Correia',
      email: 'mariana.correia@example.pt',
      phone: '+351 912 101 014',
      birthDate: createDate(1999, 1, 9),
      joinDate: createDate(2024, 7, 25),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1015',
      firstName: 'Nuno',
      lastName: 'Gomes',
      email: 'nuno.gomes@example.pt',
      phone: '+351 912 101 015',
      birthDate: createDate(1984, 5, 17),
      joinDate: createDate(2024, 8, 8),
      notes: 'Prefere campos exteriores.',
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1016',
      firstName: 'Rita',
      lastName: 'Marques',
      email: 'rita.marques@example.pt',
      phone: '+351 912 101 016',
      birthDate: createDate(1992, 11, 12),
      joinDate: createDate(2024, 8, 26),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1017',
      firstName: 'Gonçalo',
      lastName: 'Neves',
      email: 'goncalo.neves@example.pt',
      phone: '+351 912 101 017',
      birthDate: createDate(1986, 3, 1),
      joinDate: createDate(2024, 9, 13),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1018',
      firstName: 'Catarina',
      lastName: 'Nunes',
      email: 'catarina.nunes@example.pt',
      phone: '+351 912 101 018',
      birthDate: createDate(1995, 6, 21),
      joinDate: createDate(2024, 9, 29),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1019',
      firstName: 'Filipe',
      lastName: 'Teixeira',
      email: 'filipe.teixeira@example.pt',
      phone: '+351 912 101 019',
      birthDate: createDate(1990, 9, 18),
      joinDate: createDate(2024, 10, 15),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1020',
      firstName: 'Leonor',
      lastName: 'Cardoso',
      email: 'leonor.cardoso@example.pt',
      phone: '+351 912 101 020',
      birthDate: createDate(1997, 12, 5),
      joinDate: createDate(2024, 11, 2),
      notes: 'Inscrita no grupo de iniciação.',
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1021',
      firstName: 'Hugo',
      lastName: 'Pinto',
      email: 'hugo.pinto@example.pt',
      phone: '+351 912 101 021',
      birthDate: createDate(1983, 8, 25),
      joinDate: createDate(2024, 11, 20),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1022',
      firstName: 'Daniela',
      lastName: 'Rocha',
      email: 'daniela.rocha@example.pt',
      phone: '+351 912 101 022',
      birthDate: createDate(1993, 10, 14),
      joinDate: createDate(2024, 12, 8),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1023',
      firstName: 'Bruno',
      lastName: 'Vieira',
      email: 'bruno.vieira@example.pt',
      phone: '+351 912 101 023',
      birthDate: createDate(1988, 4, 29),
      joinDate: createDate(2025, 1, 14),
      notes: 'Inscrição temporariamente suspensa.',
      isActive: false,
    },
    {
      membershipNumber: 'APCM-1024',
      firstName: 'Cláudia',
      lastName: 'Faria',
      email: 'claudia.faria@example.pt',
      phone: '+351 912 101 024',
      birthDate: createDate(1991, 2, 7),
      joinDate: createDate(2025, 2, 3),
      isActive: true,
    },
    {
      membershipNumber: 'APCM-1025',
      firstName: 'Rui',
      lastName: 'Azevedo',
      email: 'rui.azevedo@example.pt',
      phone: '+351 912 101 025',
      birthDate: createDate(1982, 7, 4),
      joinDate: createDate(2025, 3, 11),
      notes: 'Sócio inativo por motivos pessoais.',
      isActive: false,
    },
  ];
}

function getCoaches(): CoachSeed[] {
  return [
    {
      employeeNumber: 'TR-001',
      firstName: 'André',
      lastName: 'Silva',
      email: 'andre.silva@atlanticapadel.pt',
      phone: '+351 913 200 001',
      specialization: 'Iniciação e nível intermédio',
      biography:
        'Treinador certificado, especializado no acompanhamento de jogadores em fase de iniciação e consolidação técnica.',
      hireDate: createDate(2022, 9, 1),
      isActive: true,
    },
    {
      employeeNumber: 'TR-002',
      firstName: 'Carolina',
      lastName: 'Mendes',
      email: 'carolina.mendes@atlanticapadel.pt',
      phone: '+351 913 200 002',
      specialization: 'Competição e preparação física',
      biography:
        'Treinadora orientada para competição, preparação física e desenvolvimento de estratégias de jogo.',
      hireDate: createDate(2023, 1, 16),
      isActive: true,
    },
    {
      employeeNumber: 'TR-003',
      firstName: 'Diogo',
      lastName: 'Ramos',
      email: 'diogo.ramos@atlanticapadel.pt',
      phone: '+351 913 200 003',
      specialization: 'Técnica avançada',
      biography:
        'Treinador com experiência em técnica avançada, posicionamento em campo e análise de desempenho.',
      hireDate: createDate(2023, 6, 5),
      isActive: true,
    },
    {
      employeeNumber: 'TR-004',
      firstName: 'Mariana',
      lastName: 'Correia',
      email: 'mariana.correia@atlanticapadel.pt',
      phone: '+351 913 200 004',
      specialization: 'Formação juvenil',
      biography:
        'Responsável pela formação juvenil e por programas de desenvolvimento para jovens atletas.',
      hireDate: createDate(2024, 2, 12),
      isActive: true,
    },
  ];
}

function getCourts(): CourtSeed[] {
  return [
    {
      name: 'Atlântico 1',
      description: 'Campo panorâmico interior com relva artificial azul.',
      location: 'Pavilhão Principal',
      surfaceType: CourtSurfaceType.ARTIFICIAL_GRASS,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.INDOOR,
      hourlyPrice: 28,
      openingTime: '08:00',
      closingTime: '23:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Atlântico 2',
      description: 'Campo interior destinado a reservas e aulas.',
      location: 'Pavilhão Principal',
      surfaceType: CourtSurfaceType.ARTIFICIAL_GRASS,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.INDOOR,
      hourlyPrice: 28,
      openingTime: '08:00',
      closingTime: '23:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Oceano 1',
      description: 'Campo interior com iluminação LED.',
      location: 'Pavilhão Norte',
      surfaceType: CourtSurfaceType.SYNTHETIC,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.INDOOR,
      hourlyPrice: 26,
      openingTime: '08:00',
      closingTime: '23:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Oceano 2',
      description: 'Campo interior com piso sintético de competição.',
      location: 'Pavilhão Norte',
      surfaceType: CourtSurfaceType.SYNTHETIC,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.INDOOR,
      hourlyPrice: 26,
      openingTime: '08:00',
      closingTime: '23:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Costa 1',
      description: 'Campo exterior junto à zona de convívio.',
      location: 'Zona Exterior Sul',
      surfaceType: CourtSurfaceType.ARTIFICIAL_GRASS,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.OUTDOOR,
      hourlyPrice: 22,
      openingTime: '08:00',
      closingTime: '22:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Costa 2',
      description: 'Campo exterior com iluminação para utilização noturna.',
      location: 'Zona Exterior Sul',
      surfaceType: CourtSurfaceType.ARTIFICIAL_GRASS,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.OUTDOOR,
      hourlyPrice: 22,
      openingTime: '08:00',
      closingTime: '22:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Central',
      description: 'Campo principal utilizado em torneios e eventos.',
      location: 'Zona Central',
      surfaceType: CourtSurfaceType.ARTIFICIAL_GRASS,
      courtType: CourtType.DOUBLES,
      environment: CourtEnvironment.OUTDOOR,
      hourlyPrice: 30,
      openingTime: '08:00',
      closingTime: '23:00',
      defaultReservationDuration: 90,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
    {
      name: 'Academia',
      description: 'Campo individual dedicado à formação e treino técnico.',
      location: 'Área de Formação',
      surfaceType: CourtSurfaceType.SYNTHETIC,
      courtType: CourtType.SINGLES,
      environment: CourtEnvironment.INDOOR,
      hourlyPrice: 18,
      openingTime: '09:00',
      closingTime: '21:00',
      defaultReservationDuration: 60,
      reservationInterval: 0,
      hasLighting: true,
      isUnderMaintenance: false,
      isActive: true,
    },
  ];
}

async function cleanDemoData(clubId: string): Promise<void> {
  console.log('A remover dados de demonstração anteriores...');

  await prisma.reservation.deleteMany({
    where: {
      clubId,
    },
  });

  await prisma.member.deleteMany({
    where: {
      clubId,
    },
  });

  await prisma.coach.deleteMany({
    where: {
      clubId,
    },
  });

  await prisma.court.deleteMany({
    where: {
      clubId,
    },
  });
}

async function seedMembers(clubId: string) {
  const members = getMembers();

  await prisma.member.createMany({
    data: members.map((member) => ({
      clubId,
      membershipNumber: member.membershipNumber,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      birthDate: member.birthDate,
      joinDate: member.joinDate,
      notes: member.notes,
      isActive: member.isActive,
    })),
  });

  return prisma.member.findMany({
    where: {
      clubId,
    },
    orderBy: {
      membershipNumber: 'asc',
    },
  });
}

async function seedCoaches(clubId: string) {
  const coaches = getCoaches();

  await prisma.coach.createMany({
    data: coaches.map((coach) => ({
      clubId,
      employeeNumber: coach.employeeNumber,
      firstName: coach.firstName,
      lastName: coach.lastName,
      email: coach.email,
      phone: coach.phone,
      specialization: coach.specialization,
      biography: coach.biography,
      hireDate: coach.hireDate,
      isActive: coach.isActive,
    })),
  });

  return prisma.coach.findMany({
    where: {
      clubId,
    },
    orderBy: {
      employeeNumber: 'asc',
    },
  });
}

async function seedCourts(clubId: string) {
  const courts = getCourts();

  await prisma.court.createMany({
    data: courts.map((court) => ({
      clubId,
      name: court.name,
      description: court.description,
      location: court.location,
      surfaceType: court.surfaceType,
      courtType: court.courtType,
      environment: court.environment,
      hourlyPrice: court.hourlyPrice,
      openingTime: court.openingTime,
      closingTime: court.closingTime,
      defaultReservationDuration: court.defaultReservationDuration,
      reservationInterval: court.reservationInterval,
      hasLighting: court.hasLighting,
      isUnderMaintenance: court.isUnderMaintenance,
      maintenanceNotes: court.maintenanceNotes,
      isActive: court.isActive,
    })),
  });

  return prisma.court.findMany({
    where: {
      clubId,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

async function seedReservations(
  clubId: string,
  members: Awaited<ReturnType<typeof seedMembers>>,
  courts: Awaited<ReturnType<typeof seedCourts>>,
): Promise<number> {
  const reservations: Prisma.ReservationCreateManyInput[] = [];

  function addReservation(options: {
    memberIndex: number;
    courtIndex: number;
    dayOffset: number;
    hour: number;
    minute?: number;
    duration?: number;
    status: ReservationStatus;
    notes?: string;
    cancellationReason?: string;
  }): void {
    const member = getCyclicItem(members, options.memberIndex);
    const court = getCyclicItem(courts, options.courtIndex);

    const minute = options.minute ?? 0;
    const duration =
      options.duration ?? court.defaultReservationDuration ?? 90;

    const startTime = createRelativeDate(
      options.dayOffset,
      options.hour,
      minute,
    );

    const endTime = addMinutes(startTime, duration);

    const hourlyPrice = Number(court.hourlyPrice ?? 0);
    const totalPrice = Number(
      ((hourlyPrice * duration) / 60).toFixed(2),
    );

    const isCancelled =
      options.status === ReservationStatus.CANCELLED;

    reservations.push({
      clubId,
      courtId: court.id,
      memberId: member.id,
      startTime,
      endTime,
      status: options.status,
      totalPrice,
      notes: options.notes,
      cancellationReason: isCancelled
        ? options.cancellationReason ??
          'Reserva cancelada pelo sócio.'
        : null,
      cancelledAt: isCancelled
        ? addMinutes(startTime, -180)
        : null,
    });
  }

  /*
   * Reservas dos últimos sete dias.
   * São sobretudo reservas concluídas, com algumas faltas e cancelamentos.
   */
  for (let dayOffset = -7; dayOffset <= -1; dayOffset += 1) {
    const dayIndex = Math.abs(dayOffset);

    addReservation({
      memberIndex: dayIndex,
      courtIndex: dayIndex,
      dayOffset,
      hour: 10,
      status: ReservationStatus.COMPLETED,
      notes: 'Reserva concluída.',
    });

    addReservation({
      memberIndex: dayIndex + 5,
      courtIndex: dayIndex + 2,
      dayOffset,
      hour: 17,
      minute: 30,
      status:
        dayIndex % 4 === 0
          ? ReservationStatus.NO_SHOW
          : ReservationStatus.COMPLETED,
      notes:
        dayIndex % 4 === 0
          ? 'O sócio não compareceu.'
          : 'Reserva concluída.',
    });

    addReservation({
      memberIndex: dayIndex + 10,
      courtIndex: dayIndex + 4,
      dayOffset,
      hour: 20,
      status:
        dayIndex % 3 === 0
          ? ReservationStatus.CANCELLED
          : ReservationStatus.COMPLETED,
      cancellationReason:
        dayIndex % 3 === 0
          ? 'Impossibilidade de comparência.'
          : undefined,
    });
  }

  /*
   * Reservas para o dia atual.
   * O Dashboard deverá apresentar oito reservas ativas e duas canceladas.
   */
  const todaySlots = [
    { hour: 9, minute: 0 },
    { hour: 10, minute: 30 },
    { hour: 12, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 15, minute: 30 },
    { hour: 17, minute: 0 },
    { hour: 18, minute: 30 },
    { hour: 20, minute: 0 },
  ];

  todaySlots.forEach((slot, index) => {
    addReservation({
      memberIndex: index + 2,
      courtIndex: index,
      dayOffset: 0,
      hour: slot.hour,
      minute: slot.minute,
      status: ReservationStatus.CONFIRMED,
      notes:
        index % 3 === 0
          ? 'Reserva regular de sócio.'
          : undefined,
    });
  });

  addReservation({
    memberIndex: 18,
    courtIndex: 1,
    dayOffset: 0,
    hour: 11,
    status: ReservationStatus.CANCELLED,
    cancellationReason: 'Alteração da disponibilidade do sócio.',
  });

  addReservation({
    memberIndex: 20,
    courtIndex: 5,
    dayOffset: 0,
    hour: 19,
    minute: 30,
    status: ReservationStatus.CANCELLED,
    cancellationReason: 'Condições meteorológicas adversas.',
  });

  /*
   * Reservas para os próximos sete dias.
   * São criadas cinco reservas por dia.
   */
  const futureSlots = [
    { hour: 9, minute: 0 },
    { hour: 11, minute: 0 },
    { hour: 16, minute: 0 },
    { hour: 18, minute: 0 },
    { hour: 20, minute: 30 },
  ];

  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    futureSlots.forEach((slot, slotIndex) => {
      const reservationIndex =
        dayOffset * futureSlots.length + slotIndex;

      addReservation({
        memberIndex: reservationIndex,
        courtIndex: reservationIndex + dayOffset,
        dayOffset,
        hour: slot.hour,
        minute: slot.minute,
        status:
          slotIndex === 1 && dayOffset % 2 === 0
            ? ReservationStatus.PENDING
            : ReservationStatus.CONFIRMED,
        notes:
          slotIndex === 4
            ? 'Reserva em horário de maior procura.'
            : undefined,
      });
    });
  }

  await prisma.reservation.createMany({
    data: reservations,
  });

  return reservations.length;
}

async function main(): Promise<void> {
  console.log('A iniciar o seed do Atlantica Padel Club Manager...');

  const club = await seedClub();

  console.log(`Clube selecionado: ${club.name}`);

  await cleanDemoData(club.id);

  const members = await seedMembers(club.id);
  console.log(`${members.length} sócios criados.`);

  const coaches = await seedCoaches(club.id);
  console.log(`${coaches.length} treinadores criados.`);

  const courts = await seedCourts(club.id);
  console.log(`${courts.length} campos criados.`);

  const reservationCount = await seedReservations(
    club.id,
    members,
    courts,
  );

  console.log(`${reservationCount} reservas criadas.`);

  const summary = await prisma.club.findUnique({
    where: {
      id: club.id,
    },
    select: {
      name: true,
      _count: {
        select: {
          users: true,
          members: true,
          coaches: true,
          courts: true,
          reservations: true,
        },
      },
    },
  });

  console.log('');
  console.log('Seed concluído com sucesso.');
  console.log('Resumo:');
  console.log(`- Clube: ${summary?.name}`);
  console.log(`- Utilizadores preservados: ${summary?._count.users}`);
  console.log(`- Sócios: ${summary?._count.members}`);
  console.log(`- Treinadores: ${summary?._count.coaches}`);
  console.log(`- Campos: ${summary?._count.courts}`);
  console.log(`- Reservas: ${summary?._count.reservations}`);
}

main()
  .catch((error: unknown) => {
    console.error('Ocorreu um erro durante o seed.');

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });