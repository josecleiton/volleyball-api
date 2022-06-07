import { TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
require('dotenv/config');

export async function stubDatabaseConnection(
  builder: TestingModuleBuilder,
): Promise<TestingModuleBuilder> {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: false,
  });

  const urlObj = new URL(process.env.DATABASE_URL as string);
  urlObj.pathname = randomUUID().replace(/-/g, '_');

  try {
    await connection.query(`CREATE DATABASE "${urlObj.pathname}"`);
  } finally {
    await connection.close();
  }

  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    url: urlObj.toString(),
    entities: [__dirname + '/../../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../../database/migrations/*.{js,ts}'],
    subscribers: [__dirname + '/../../**/*.subscriber.{js,ts}'],
    synchronize: false,
    migrationsRun: true,
    namingStrategy: new SnakeNamingStrategy(),
    logging: false,
  };

  builder
    .overrideProvider('PARTIAL_CONFIGURATION_KEYdatabase')
    .useValue(options);

  return builder;
}
