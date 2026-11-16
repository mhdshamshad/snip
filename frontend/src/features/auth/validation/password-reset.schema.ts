import { z } from 'zod';

import { emailRule, otpRule, passwordRule } from './auth.rules';

export const forgotPasswordSchema = z.object({
  email: emailRule,
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: emailRule,
    otp: otpRule,
    newPassword: passwordRule,
    confirmPassword: z.string().trim().min(1, 'Confirm password is required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordRequest = Omit<ResetPasswordFormType, 'confirmPassword'>;
