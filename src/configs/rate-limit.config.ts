import { registerAs } from '@nestjs/config';

const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = process.env;
// TODO: if the app run in multiple servers, than provite an redis connections bellow
export const rateLimitConfig = registerAs('rateLimit', () => ({
  windowMs: parseInt(RATE_LIMIT_WINDOW_MS ?? '6000'),
  max: parseInt(RATE_LIMIT_MAX ?? '20'),
}));
