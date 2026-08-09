import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(2),
    description: z.string({ required_error: 'Description is required' }).min(5),
    price: z.number({ required_error: 'Price is required' }).positive(),
    stock: z.number().int().nonnegative().optional(),
    images: z.array(z.string()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
    categoryId: z.string({ required_error: 'Category is required' }),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    images: z.array(z.string()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
    categoryId: z.string().optional(),
  }),
});

export const ProductValidation = { createProductValidation, updateProductValidation };
