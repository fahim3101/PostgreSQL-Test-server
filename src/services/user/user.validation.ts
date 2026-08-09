import { z } from 'zod';

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

const changeRoleValidation = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'USER']),
  }),
});

export const UserValidation = { updateUserValidation, changeRoleValidation };
