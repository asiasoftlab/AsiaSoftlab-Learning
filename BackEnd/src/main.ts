import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configuredOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
    : [];

  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://asia-softlab-learning.vercel.app',
  ];

  const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      try {
        const url = new URL(origin);
        const isVercel = /\.vercel\.app$/.test(url.hostname);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || isVercel) {
          return callback(null, true);
        }
      } catch {
        // invalid URL
      }

      // Deny CORS gracefully without throwing an unhandled server exception
      callback(null, false);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

