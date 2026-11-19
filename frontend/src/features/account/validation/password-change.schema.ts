import { passwordRule } from '@/features/auth/validation/auth.rules';
import z from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordRule,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine(v => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine(v => v.newPassword !== v.currentPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current one',
  });
export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
export type ChangePasswordInput = Omit<ChangePasswordFormType, 'confirmPassword'>;
