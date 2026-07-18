import { Prisma } from '../../generated/prisma/client';
import { USER_SELECT } from '../constants/user-select.constant';

export type UserResponse = Prisma.UserGetPayload<{
  select: typeof USER_SELECT;
}>;