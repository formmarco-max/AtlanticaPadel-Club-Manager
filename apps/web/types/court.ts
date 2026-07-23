export type CourtSurfaceType =
  | 'ARTIFICIAL_GRASS'
  | 'CONCRETE'
  | 'SYNTHETIC'
  | 'OTHER';

export type CourtType =
  | 'SINGLES'
  | 'DOUBLES';

export type CourtEnvironment =
  | 'INDOOR'
  | 'OUTDOOR';

export interface CourtClub {
  id: string;
  name: string;
  slug: string;
}

export interface Court {
  id: string;
  clubId: string;

  name: string;
  description: string | null;
  location: string | null;

  surfaceType: CourtSurfaceType;
  courtType: CourtType;
  environment: CourtEnvironment;

  /**
   * Os campos Decimal do Prisma podem chegar ao frontend
   * como string, dependendo da serialização da API.
   */
  hourlyPrice: string | number | null;

  openingTime: string;
  closingTime: string;

  defaultReservationDuration: number;
  reservationInterval: number;

  hasLighting: boolean;

  isUnderMaintenance: boolean;
  maintenanceNotes: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  club: CourtClub;
}

export interface CourtPayload {
  name: string;
  description?: string;
  location?: string;
  surfaceType?: CourtSurfaceType;
  courtType?: CourtType;
  environment?: CourtEnvironment;
  hourlyPrice?: number;
  isActive?: boolean;
}