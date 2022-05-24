import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    keepConnectionAlive: true,
    maxQueryExecutionTime: parseInt(process.env.DB_QUERY_TIMEOUT ?? '5000'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
    subscribers: [__dirname + '/../**/*.subscriber.{js,ts}'],
    synchronize: false,
    migrationsRun: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    cli: {
      migrationsDir: 'src/database/migrations',
    },
    namingStrategy: new SnakeNamingStrategy(),
    ssl: {
      rejectUnauthorized: false,
    },
  }),
);
