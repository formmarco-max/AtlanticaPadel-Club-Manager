import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { AuthenticatedUser } from '../strategies/jwt.strategy';

type RequestWithUser = {
  user: AuthenticatedUser;
};

export const CurrentUser = createParamDecorator(
  (
    property: keyof AuthenticatedUser | undefined,
    context: ExecutionContext,
  ): AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] => {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    const user = request.user;

    return property ? user[property] : user;
  },
);