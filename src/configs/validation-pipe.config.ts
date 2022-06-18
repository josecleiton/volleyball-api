import { ValidationPipeOptions } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const validationPipeConfig = registerAs(
  'validation',
  (): ValidationPipeOptions => ({
    transform: true,
    whitelist: true,
  }),
);
