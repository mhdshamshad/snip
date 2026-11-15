import { Environment, validate } from './env.validation';

const validEnv = {
  NODE_ENV: 'development',
  PORT: '3000',
  FRONTEND_URL: 'http://localhost:5173',
  BASE_URL: 'http://localhost:3000',
  DATABASE_URL:
    'postgresql://user:password@localhost:5432/snip?sslmode=require',
  REDIS_URL: 'redis://localhost:6379',
  NODEMAILER_EMAIL: 'test@example.com',
  NODEMAILER_PASSWORD: 'testpassword',
  JWT_ACCESS_SECRET: 'access_secret_12345',
  JWT_REFRESH_SECRET: 'refresh_secret_12345',
  JWT_ACCESS_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN_DAYS: '7',
};

describe('env.validation', () => {
  it('accepts valid environment values and coerces numbers', () => {
    const result = validate(validEnv);

    expect(result.PORT).toBe(3000);
    expect(result.NODE_ENV).toBe(Environment.Development);
    expect(result.FRONTEND_URL).toBe('http://localhost:5173');
    expect(result.BASE_URL).toBe('http://localhost:3000');
    expect(result.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    expect(result.REDIS_URL).toBe(validEnv.REDIS_URL);
    expect(result.JWT_ACCESS_SECRET).toBe('access_secret_12345');
    expect(result.REFRESH_TOKEN_EXPIRES_IN_DAYS).toBe(7);
  });

  it('throws on missing required variable', () => {
    const incompleteEnv = { ...validEnv };
    delete (incompleteEnv as any).DATABASE_URL;

    expect(() => validate(incompleteEnv)).toThrow();
  });

  it('throws on invalid NODE_ENV', () => {
    expect(() =>
      validate({
        ...validEnv,
        NODE_ENV: 'invalid_env',
      }),
    ).toThrow();
  });
});
