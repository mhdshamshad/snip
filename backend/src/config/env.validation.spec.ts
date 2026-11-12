import { Environment, validate } from './env.validation';

const validDatabaseUrl =
  'postgresql://user:password@localhost:5432/snip?sslmode=require';

describe('env.validation', () => {
  it('applies defaults when optional variables are omitted', () => {
    const result = validate({
      DATABASE_URL: validDatabaseUrl,
    });

    expect(result.PORT).toBe(3000);
    expect(result.NODE_ENV).toBe(Environment.Development);
    expect(result.FRONTEND_URL).toBe('http://localhost:5173');
    expect(result.BASE_URL).toBe('http://localhost:3000');
    expect(result.DATABASE_URL).toBe(validDatabaseUrl);
  });

  it('accepts valid environment values', () => {
    const result = validate({
      PORT: '4000',
      NODE_ENV: 'production',
      FRONTEND_URL: 'https://snip.vercel.app',
      BASE_URL: 'https://snip-api.onrender.com',
      DATABASE_URL: validDatabaseUrl,
    });

    expect(result.PORT).toBe(4000);
    expect(result.NODE_ENV).toBe(Environment.Production);
    expect(result.FRONTEND_URL).toBe('https://snip.vercel.app');
    expect(result.BASE_URL).toBe('https://snip-api.onrender.com');
    expect(result.DATABASE_URL).toBe(validDatabaseUrl);
  });

  it('throws on invalid PORT, BASE_URL, NODE_ENV, or DATABASE_URL', () => {
    expect(() =>
      validate({ PORT: '70000', DATABASE_URL: validDatabaseUrl }),
    ).toThrow();
    expect(() =>
      validate({
        BASE_URL: 'ftp://invalid.example.com',
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toThrow();
    expect(() =>
      validate({ NODE_ENV: 'staging', DATABASE_URL: validDatabaseUrl }),
    ).toThrow();
    expect(() => validate({})).toThrow();
    expect(() =>
      validate({ DATABASE_URL: 'mysql://localhost:3306/snip' }),
    ).toThrow();
  });
});
