import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WishlistService } from './wishlist.service';

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistService.addToWishlist(req.user!.id, req.body.productId);
  sendResponse(res, { statusCode: 201, success: true, message: 'Product added to wishlist', data: result });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistService.getMyWishlist(req.user!.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Wishlist retrieved successfully', data: result });
});

const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistService.removeFromWishlist(req.user!.id, req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: 'Product removed from wishlist', data: result });
});

export const WishlistController = { addToWishlist, getMyWishlist, removeFromWishlist };
