import { z } from 'zod';

const addToWishlistValidation = z.object({
  body: z.object({
    productId: z.string({ required_error: 'Product is required' }),
  }),
});

export const WishlistValidation = { addToWishlistValidation };
