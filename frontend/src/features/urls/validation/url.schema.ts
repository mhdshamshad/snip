import { z } from 'zod';
import { ALIAS_MAX, ALIAS_MIN, ALIAS_REGEX } from '../constants/url.constants';

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, 'Destination URL is required')
    .max(2048, 'URL is too long')
    .url("This doesn't look like a valid URL.")
    .refine(value => {
      try {
        return ['http:', 'https:'].includes(new URL(value).protocol);
      } catch {
        return true;
      }
    }, 'Only HTTP and HTTPS URLs are supported'),
  customAlias: z
    .string()
    .trim()
    .min(ALIAS_MIN, 'Alias must be at least 3 characters')
    .max(ALIAS_MAX, 'Alias cannot exceed 32 characters')
    .regex(ALIAS_REGEX, 'Only letters, numbers, hyphens and underscores are allowed')
    .optional()
    .or(z.literal('')),
});

export type CreateUrlFormType = z.infer<typeof createUrlSchema>;
