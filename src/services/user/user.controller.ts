import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: 'Users retrieved successfully', meta: result.meta, data: result.data });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.user!.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Profile retrieved successfully', data: result });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'User retrieved successfully', data: result });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'User updated successfully', data: result });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.changeUserRole(req.params.id, req.body.role);
  sendResponse(res, { statusCode: 200, success: true, message: 'User role updated successfully', data: result });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.softDeleteUser(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'User deleted successfully', data: result });
});

export const UserController = { getAllUsers, getMe, getUserById, updateUser, changeUserRole, deleteUser };
