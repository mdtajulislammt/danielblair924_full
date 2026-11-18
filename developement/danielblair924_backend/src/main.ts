import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module.js';

// In-memory lightweight rate limiter to protect against brute-force attacks
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests/min per IP

function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const current = ipRequestCounts.get(ip);

  if (!current || now > current.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  current.count += 1;
  if (current.count > MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again after 1 minute.',
    });
    return;
  }

  next();
}

function helmetSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.removeHeader('X-Powered-By');
  next();
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmetSecurityHeaders);
  app.use(rateLimiterMiddleware);

  app.useStaticAssets(path.resolve(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('api');

  // Restricted CORS origins
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 FMC Backend running on http://localhost:${port}/api`);
}
bootstrap();
