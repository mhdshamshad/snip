import { randomInt } from 'crypto';

export function generateOtp6Digit(): string {
  return randomInt(100000, 1000000).toString();
}
