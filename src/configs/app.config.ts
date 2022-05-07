import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
  description: string;
  version: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
  }),
);

