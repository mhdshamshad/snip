import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class Env {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsInt()
  PORT!: number;

  @IsNotEmpty()
  @IsString()
  FRONTEND_URL!: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_ID!: string;

  @IsNotEmpty()
  @IsString()
  BASE_URL!: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL!: string;

  @IsNotEmpty()
  @IsString()
  REDIS_URL!: string;

  @IsNotEmpty()
  @IsString()
  NODEMAILER_EMAIL!: string;

  @IsNotEmpty()
  @IsString()
  NODEMAILER_PASSWORD!: string;

  @IsNotEmpty()
  @IsString()
  ACCESS_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  REFRESH_SECRET!: string;

  @IsInt()
  @Min(10)
  ACCESS_EXPIRY_MINUTES!: number;

  @IsInt()
  @Min(1)
  REFRESH_EXPIRY_DAYS!: number;
}

export function validate(config: Record<string, unknown>): Env {
  const env = plainToInstance(Env, config, { enableImplicitConversion: true });
  const errors = validateSync(env);

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n${errors.toString()}`);
  }
  return env;
}
