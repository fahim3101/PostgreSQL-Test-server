import { z } from 'zod';

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2),
    description: z.string().optional(),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});

export const CategoryValidation = { createCategoryValidation, updateCategoryValidation };
