import { z } from 'zod';

import { emailRule, otpRule } from './auth.rules';

export const verifyOtpSchema = z.object({
  email: emailRule,
  otp: otpRule,
});

export type VerifyOtpFormType = z.infer<typeof verifyOtpSchema>;
export type ResendOtpRequest = Pick<VerifyOtpFormType, 'email'>;
