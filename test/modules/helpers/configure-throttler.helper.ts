import { TestingModuleBuilder } from '@nestjs/testing';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export function configureThrottler(
  builder: TestingModuleBuilder,
): TestingModuleBuilder {
  const options: ThrottlerModuleOptions = { limit: 100000, ttl: 1 };

  builder.overrideProvider('CONFIGURATION(rateLimit)').useValue(options);

  return builder;
}
