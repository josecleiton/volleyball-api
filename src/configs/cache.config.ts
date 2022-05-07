import { CacheModuleOptions } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs(
  'cache',
  (): CacheModuleOptions => ({
    ttl: 5,
    max: 10,
  }),
);
