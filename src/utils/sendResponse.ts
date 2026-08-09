import { Response } from 'express';

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: { page: number; limit: number; total: number };
  data?: T;
};

const sendResponse = <T>(res: Response, response: ApiResponse<T>) => {
  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    meta: response.meta,
    data: response.data,
  });
};

export default sendResponse;
