export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export interface ReservationClub {
  id: string;
  name: string;
  slug: string;
}

export interface ReservationCourt {
  id: string;
  name: string;
  location: string | null;
  surfaceType: string;
  courtType: string;
  environment: string;
  hourlyPrice: string | number | null;
  openingTime: string;
  closingTime: string;
  defaultReservationDuration: number;
  reservationInterval: number;
  hasLighting: boolean;
  isActive: boolean;
  isUnderMaintenance: boolean;
}

export interface ReservationMember {
  id: string;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  clubId: string;
  courtId: string;
  memberId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: string | number | null;
  notes: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  club: ReservationClub;
  court: ReservationCourt;
  member: ReservationMember;
}

export interface ReservationPayload {
  courtId: string;
  memberId: string;
  startTime: string;
  endTime: string;
  status?: ReservationStatus;
  totalPrice?: number;
  notes?: string;
}
