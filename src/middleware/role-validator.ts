import type { NextFunction, Request, Response } from 'express';
import type { Role } from '../config';
import { SendResponse } from '../core';
import { JWTToken } from '../core/jwt-token';

export const roleValidator =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // check if Bearer token exists in Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.includes('Bearer')
      ? authHeader.split(' ')[1]
      : undefined;

    if (!token) {
      return SendResponse.unauthorized({ res, message: 'Unauthorized' });
    }

    // validate token
    const user = JWTToken.verify<{
      id: number;
      email: string;
      role: Role;
    }>(token);

    if (!user) {
      return SendResponse.unauthorized({ res, message: 'Unauthorized' });
    }

    // check if user role is allowed
    if (!allowedRoles.includes(user.role)) {
      return SendResponse.forbidden({ res, message: 'Forbidden' });
    }

    // attach user to request object
    req.user = user;

    next();
  };
