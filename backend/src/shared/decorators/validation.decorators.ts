import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Trim } from './trim.decorator';

export const NameField = () =>
  applyDecorators(
    Trim(),
    IsString(),
    IsNotEmpty({ message: 'Name is required' }),
    Matches(/^(?=.{3,30}$)[A-Za-z]+( [A-Za-z]+)*$/, {
      message:
        'Name must be 3-30 characters and contain only letters separated by single spaces',
    }),
  );

export const EmailField = () =>
  applyDecorators(
    Transform(
      ({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
      {
        toClassOnly: true,
      },
    ),
    IsEmail({}, { message: 'A valid email is required' }),
    IsNotEmpty({ message: 'Email is required' }),
  );

export const PasswordField = () =>
  applyDecorators(
    Trim(),
    IsString(),
    IsNotEmpty({ message: 'Password is required' }),
    MinLength(8, { message: 'Password must be at least 8 characters' }),
    MaxLength(25, { message: 'Password cannot exceed 25 characters' }),
    Matches(/[a-z]/, { message: 'Must contain a lowercase letter' }),
    Matches(/[A-Z]/, { message: 'Must contain an uppercase letter' }),
    Matches(/\d/, { message: 'Must contain a number' }),
    Matches(/[^A-Za-z0-9]/, { message: 'Must contain a special character' }),
  );

export const OtpField = () =>
  applyDecorators(
    Trim(),
    Matches(/^\d{6}$/, { message: 'Code must be 6 digits' }),
  );
