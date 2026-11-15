import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
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
  JWT_ACCESS_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_EXPIRES_IN!: string;

  @IsInt()
  REFRESH_TOKEN_EXPIRES_IN_DAYS!: number;
}

export function validate(config: Record<string, unknown>): Env {
  const env = plainToInstance(Env, config, { enableImplicitConversion: true });
  const errors = validateSync(env);

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n${errors.toString()}`);
  }
  return env;
}
