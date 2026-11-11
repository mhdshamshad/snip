import { Environment, validate } from './env.validation';

describe('env.validation', () => {
  it('applies defaults when optional variables are omitted', () => {
    const result = validate({});

    expect(result.PORT).toBe(3000);
    expect(result.NODE_ENV).toBe(Environment.Development);
    expect(result.FRONTEND_URL).toBe('http://localhost:5173');
    expect(result.BASE_URL).toBe('http://localhost:3000');
  });

  it('accepts valid environment values', () => {
    const result = validate({
      PORT: '4000',
      NODE_ENV: 'production',
      FRONTEND_URL: 'https://snip.vercel.app',
      BASE_URL: 'https://snip-api.onrender.com',
    });

    expect(result.PORT).toBe(4000);
    expect(result.NODE_ENV).toBe(Environment.Production);
    expect(result.FRONTEND_URL).toBe('https://snip.vercel.app');
    expect(result.BASE_URL).toBe('https://snip-api.onrender.com');
  });

  it('throws on invalid PORT or BASE_URL', () => {
    expect(() => validate({ PORT: '70000' })).toThrow();
    expect(() => validate({ BASE_URL: 'ftp://invalid.example.com' })).toThrow();
    expect(() => validate({ NODE_ENV: 'staging' })).toThrow();
  });
});
