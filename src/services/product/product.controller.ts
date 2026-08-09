import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: 'Product created successfully', data: result });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query as any);
  sendResponse(res, { statusCode: 200, success: true, message: 'Products retrieved successfully', meta: result.meta, data: result.data });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Product retrieved successfully', data: result });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: 'Product updated successfully', data: result });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.softDeleteProduct(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Product deleted successfully', data: result });
});

export const ProductController = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
