import { z } from 'zod';

const createReviewValidation = z.object({
  body: z.object({
    productId: z.string({ required_error: 'Product is required' }),
    rating: z.number({ required_error: 'Rating is required' }).int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

const updateReviewValidation = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = { createReviewValidation, updateReviewValidation };
