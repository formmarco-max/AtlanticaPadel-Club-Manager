export interface CoachClub {
  id: string;
  name: string;
  slug: string;
}

export interface CoachUser {
  id: string;
  email: string;
}

export interface Coach {
  id: string;
  clubId: string;
  userId: string | null;
  employeeNumber: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  specialization: string | null;
  biography: string | null;
  hireDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  club: CoachClub;
  user: CoachUser | null;
}

export interface CoachPayload {
  employeeNumber?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  specialization?: string;
  biography?: string;
  hireDate?: string;
  isActive?: boolean;
}
