import { z } from 'zod';

// Email
export const emailRule = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email address format')
  .toLowerCase();

// Name
export const nameRule = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .min(3, 'Name must be at least 3 characters')
  .max(30, 'Name cannot exceed 30 characters')
  .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, 'Name can contain only letters separated by single spaces');

// Password
export const passwordRule = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(25, 'Password cannot exceed 25 characters')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/\d/, 'Must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Must contain a special character');
