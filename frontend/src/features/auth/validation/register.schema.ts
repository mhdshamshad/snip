import { z } from 'zod';
import { emailRule, nameRule, passwordRule } from './auth.rules';

export const registerSchema = z
  .object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterFormType, 'confirmPassword'>;
