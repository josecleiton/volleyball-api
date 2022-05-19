import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    keepConnectionAlive: process.env.NODE_ENV === 'development',
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
  }),
);
