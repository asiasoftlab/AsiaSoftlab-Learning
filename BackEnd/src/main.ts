import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const bootStart = Date.now();
  const logger = new Logger('Bootstrap');
  logger.log(`Starting bootstrap (Process uptime: ${Math.round(process.uptime() * 1000)}ms)`);

  const createStart = Date.now();
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const createDuration = Date.now() - createStart;
  logger.log(`NestFactory.create(AppModule) completed in ${createDuration}ms`);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable trust proxy when running behind reverse proxy (e.g. Nginx, Cloudflare, load balancers)
  if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
  }

  const configuredOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
    : [];

  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      // Deny CORS gracefully without throwing an unhandled server exception
      callback(null, false);
    },
    credentials: true,
  });

  const listenStart = Date.now();
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  const listenDuration = Date.now() - listenStart;
  const totalDuration = Date.now() - bootStart;

  logger.log(`Server listening on port ${port} (listen: ${listenDuration}ms, total bootstrap: ${totalDuration}ms)`);
}
bootstrap();

