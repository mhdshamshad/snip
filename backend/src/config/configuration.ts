export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  baseUrl: string;
  databaseUrl: string;
  redisUrl: string;
  nodemailerEmail: string;
  nodemailerPassword: string;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? '',
  nodemailerEmail: process.env.NODEMAILER_EMAIL ?? '',
  nodemailerPassword: process.env.NODEMAILER_PASSWORD ?? '',
});
