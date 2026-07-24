export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export type UserRole =
  | 'OWNER'
  | 'ADMIN'
  | 'RECEPTIONIST'
  | 'COACH'
  | 'MEMBER'
  | string;

export interface MyProfile {
  id: string;
  clubId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
}

export interface ClubSettings {
  id: string;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
}

export interface UpdateMyProfilePayload {
  firstName: string;
  lastName: string;
}

export interface UpdateClubPayload {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
}
