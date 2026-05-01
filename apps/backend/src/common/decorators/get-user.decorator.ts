import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../../core/auth/interfaces/user-payload.interface';

export const GetUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext): any => {
    // 반환 타입을 any로 열어주거나
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UserPayload }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
