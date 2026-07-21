export interface MemberClub {
  id: string;
  name: string;
  slug: string;
}

export interface MemberUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Member {
  id: string;
  clubId: string;
  userId: string | null;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  joinDate: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  club: MemberClub;
  user: MemberUser | null;
}