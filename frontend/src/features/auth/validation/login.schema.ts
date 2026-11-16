import { z } from 'zod';
import { emailRule } from './auth.rules';

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().trim().min(1, 'Password is required'),
});

export type LoginFormType = z.infer<typeof loginSchema>;
