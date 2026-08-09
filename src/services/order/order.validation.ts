import { z } from 'zod';

const createOrderValidation = z.object({
  body: z.object({
    shippingAddress: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.string({ required_error: 'Product is required' }),
          quantity: z.number({ required_error: 'Quantity is required' }).int().positive(),
        })
      )
      .min(1, 'At least one item is required'),
  }),
});

const updateOrderStatusValidation = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
  }),
});

export const OrderValidation = { createOrderValidation, updateOrderStatusValidation };
