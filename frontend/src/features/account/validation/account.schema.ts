import { emailRule, nameRule } from '@/features/auth/validation/auth.rules';
import z from 'zod';

export const nameSchema = z.object({
  name: nameRule,
});

export const emailSchema = z.object({
  email: emailRule,
});

export type EmailFormType = z.infer<typeof emailSchema>;

export type NameFormType = z.infer<typeof nameSchema>;
