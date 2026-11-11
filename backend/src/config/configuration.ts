export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  baseUrl: string;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
});
