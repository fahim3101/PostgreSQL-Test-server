import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import ApiError from '../utils/ApiError';
import config from '../config';

const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorDetails: unknown = undefined;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (error.code === 'P2002') {
      message = `Duplicate value for field: ${(error.meta?.target as string[])?.join(', ')}`;
    } else if (error.code === 'P2025') {
      statusCode = 404;
      message = 'Requested record was not found';
    } else {
      message = error.message;
    }
    errorDetails = error.meta;
  } else if (error instanceof Error) {
    message = error.message;
    errorDetails = config.env === 'development' ? error.stack : undefined;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};

export default globalErrorHandler;
