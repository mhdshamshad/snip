import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Env } from './config/env.validation';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './shared/filters/prisma-client-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);

  const frontendUrl = configService.getOrThrow('FRONTEND_URL', { infer: true });
  const origins = frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cookieParser());
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // Public redirect route
  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaClientExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Snip API')
    .setDescription('Authenticated URL shortener API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.getOrThrow('PORT', { infer: true });
  await app.listen(port);
}
void bootstrap();
