import 'reflect-metadata';
import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsOptional()
  @IsString()
  FRONTEND_URL: string = 'http://localhost:5173';

  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_tld: false,
  })
  BASE_URL: string = 'http://localhost:3000';

  @IsString()
  @IsNotEmpty()
  @Matches(/^postgres(ql)?:\/\//, {
    message: 'DATABASE_URL must be a PostgreSQL connection string',
  })
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^rediss?:\/\//, {
    message:
      'REDIS_URL must be a Redis connection string (redis:// or rediss://)',
  })
  REDIS_URL: string;

  @IsString()
  NODEMAILER_EMAIL: string;

  @IsString()
  NODEMAILER_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
