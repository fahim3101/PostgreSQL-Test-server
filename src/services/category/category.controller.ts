import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Category created successfully', data: result });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: 'Categories retrieved successfully', meta: result.meta, data: result.data });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoryById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Category retrieved successfully', data: result });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Category updated successfully', data: result });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.softDeleteCategory(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Category deleted successfully', data: result });
});

export const CategoryController = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
