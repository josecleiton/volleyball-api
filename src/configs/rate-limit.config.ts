import { registerAs } from '@nestjs/config';

export interface IRateLimitConfig {
  ttl: number;
  limit: number;
}

export const rateLimitConfig = registerAs(
  'rateLimit',
  (): IRateLimitConfig => ({
    ttl: parseInt(process.env.RATE_LIMIT_TTL ?? '60'),
    limit: parseInt(process.env.RATE_LIMIT_MAX ?? '20'),
  }),
);
