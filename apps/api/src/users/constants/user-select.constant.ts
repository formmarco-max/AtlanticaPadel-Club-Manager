import { Prisma } from '../../generated/prisma/client';

export const USER_SELECT = {
  id: true,
  roleId: true,
  email: true,
  firstName: true,
  lastName: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
} satisfies Prisma.UserSelect;