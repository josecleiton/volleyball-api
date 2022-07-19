import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
  description: string;
  version: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    name: process.env.APP_NAME ?? 'voleibol-api',
    description:
      process.env.APP_DESCRIPTION ??
      'API para acompanhamento de um campeonato de volei seguindo a CBV',
    version: process.env.APP_VERSION ?? '0.0.1',
  }),
);
