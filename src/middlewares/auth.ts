import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import ApiError from '../utils/ApiError';
import { Role } from '@prisma/client';

const auth = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

      if (!token) {
        throw new ApiError(401, 'You are not authorized. Token missing.');
      }

      const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload & {
        id: string;
        email: string;
        role: Role;
      };

      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        throw new ApiError(403, 'You do not have permission to access this resource.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
