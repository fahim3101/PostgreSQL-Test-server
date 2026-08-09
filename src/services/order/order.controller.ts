import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(req.user!.id, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Order placed successfully', data: result });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders(req.user!, req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: 'Orders retrieved successfully', meta: result.meta, data: result.data });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderById(req.params.id, req.user!);
  sendResponse(res, { statusCode: 200, success: true, message: 'Order retrieved successfully', data: result });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus(req.params.id, req.body.status);
  sendResponse(res, { statusCode: 200, success: true, message: 'Order status updated successfully', data: result });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.softDeleteOrder(req.params.id, req.user!);
  sendResponse(res, { statusCode: 200, success: true, message: 'Order cancelled successfully', data: result });
});

export const OrderController = { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder };
