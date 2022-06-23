import { TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
require('dotenv/config');

export async function stubDatabaseConnection(
  builder: TestingModuleBuilder,
): Promise<TestingModuleBuilder> {
  if (process.env.REAL_CONNECTION) {
    return builder;
  }

  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: false,
    name: randomUUID(),
  });

  const urlObj = new URL(process.env.DATABASE_URL as string);
  urlObj.pathname = randomUUID().replace(/-/g, '_');

  try {
    await connection.query(`CREATE DATABASE "${urlObj.pathname.slice(1)}"`);
  } finally {
    await connection.close();
  }

  if (process.env.LOG_DB) {
    console.log('Banco criado: ', urlObj.pathname);
  }

  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    url: urlObj.toString(),
    entities: [__dirname + '/../../../src/**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../../../src/database/migrations/*.{js,ts}'],
    subscribers: [__dirname + '/../../../src/**/*.subscriber.{js,ts}'],
    synchronize: false,
    migrationsRun: true,
    namingStrategy: new SnakeNamingStrategy(),
    logging: Boolean(process.env.LOGGING),
  };

  builder.overrideProvider('CONFIGURATION(database)').useValue(options);

  return builder;
}
